package com.hackhive.workspace.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.entity.Team;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import com.hackhive.workspace.dto.request.CreateTeamResourceRequest;
import com.hackhive.workspace.dto.request.UpdateTeamResourceRequest;
import com.hackhive.workspace.dto.response.TeamResourceResponse;
import com.hackhive.workspace.entity.TeamResource;
import com.hackhive.workspace.mapper.TeamResourceMapper;
import com.hackhive.workspace.repository.TeamResourceRepository;
import com.hackhive.workspace.service.TeamResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TeamResourceServiceImpl
        implements TeamResourceService {

    private final TeamResourceRepository teamResourceRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final TeamResourceMapper teamResourceMapper;

    private static final Set<String> VALID_RESOURCE_TYPES =
            Set.of(
                    "DOCUMENTATION",
                    "GITHUB",
                    "DESIGN",
                    "DATASET",
                    "API",
                    "LINK",
                    "OTHER"
            );

    /**
     * Get currently logged-in student's profile.
     */
    private StudentProfile getCurrentStudentProfile() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));

        return studentProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found."
                        ));
    }

    /**
     * Get team by ID.
     */
    private Team getTeam(Long teamId) {

        return teamRepository
                .findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found."
                        ));
    }

    /**
     * Verify student belongs to team.
     */
    private void validateTeamMember(
            Team team,
            StudentProfile studentProfile) {

        boolean isMember =
                teamMemberRepository
                        .existsByTeamAndStudentProfile(
                                team,
                                studentProfile
                        );

        if (!isMember) {
            throw new BadRequestException(
                    "You are not a member of this team."
            );
        }
    }

    /**
     * Validate resource type.
     */
    private String validateAndNormalizeResourceType(
            String resourceType) {

        if (resourceType == null
                || resourceType.isBlank()) {

            throw new BadRequestException(
                    "Resource type is required."
            );
        }

        String normalizedType =
                resourceType
                        .trim()
                        .toUpperCase();

        if (!VALID_RESOURCE_TYPES.contains(
                normalizedType)) {

            throw new BadRequestException(
                    "Invalid resource type. "
                            + "Allowed values: "
                            + "DOCUMENTATION, GITHUB, DESIGN, "
                            + "DATASET, API, LINK, OTHER."
            );
        }

        return normalizedType;
    }

    @Override
    @Transactional
    public TeamResourceResponse createResource(
            CreateTeamResourceRequest request) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team =
                getTeam(request.getTeamId());

        validateTeamMember(
                team,
                currentStudent
        );

        String resourceType =
                validateAndNormalizeResourceType(
                        request.getResourceType()
                );

        TeamResource resource =
                TeamResource.builder()
                        .team(team)
                        .addedBy(currentStudent)
                        .title(request.getTitle().trim())
                        .description(request.getDescription())
                        .resourceUrl(request.getResourceUrl())
                        .resourceType(resourceType)
                        .build();

        resource =
                teamResourceRepository.save(resource);

        return teamResourceMapper
                .toResponse(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResourceResponse getResourceById(
            Long resourceId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        TeamResource resource =
                teamResourceRepository
                        .findById(resourceId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Team resource not found."
                                ));

        validateTeamMember(
                resource.getTeam(),
                currentStudent
        );

        return teamResourceMapper
                .toResponse(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResourceResponse> getTeamResources(
            Long teamId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team =
                getTeam(teamId);

        validateTeamMember(
                team,
                currentStudent
        );

        return teamResourceRepository
                .findByTeam(team)
                .stream()
                .map(teamResourceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResourceResponse> getTeamResourcesByType(
            Long teamId,
            String resourceType) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team =
                getTeam(teamId);

        validateTeamMember(
                team,
                currentStudent
        );

        String normalizedType =
                validateAndNormalizeResourceType(
                        resourceType
                );

        return teamResourceRepository
                .findByTeamAndResourceType(
                        team,
                        normalizedType
                )
                .stream()
                .map(teamResourceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public TeamResourceResponse updateResource(
            Long resourceId,
            UpdateTeamResourceRequest request) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        TeamResource resource =
                teamResourceRepository
                        .findById(resourceId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Team resource not found."
                                ));

        validateTeamMember(
                resource.getTeam(),
                currentStudent
        );

        String resourceType =
                validateAndNormalizeResourceType(
                        request.getResourceType()
                );

        resource.setTitle(
                request.getTitle().trim()
        );

        resource.setDescription(
                request.getDescription()
        );

        resource.setResourceUrl(
                request.getResourceUrl()
        );

        resource.setResourceType(
                resourceType
        );

        resource =
                teamResourceRepository.save(resource);

        return teamResourceMapper
                .toResponse(resource);
    }

    @Override
    @Transactional
    public void deleteResource(
            Long resourceId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        TeamResource resource =
                teamResourceRepository
                        .findById(resourceId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Team resource not found."
                                ));

        validateTeamMember(
                resource.getTeam(),
                currentStudent
        );

        teamResourceRepository.delete(resource);
    }
}