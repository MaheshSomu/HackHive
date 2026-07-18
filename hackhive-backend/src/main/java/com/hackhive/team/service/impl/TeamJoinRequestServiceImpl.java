package com.hackhive.team.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.dto.response.TeamJoinRequestResponse;
import com.hackhive.team.entity.Team;
import com.hackhive.team.entity.TeamJoinRequest;
import com.hackhive.team.entity.TeamMember;
import com.hackhive.team.mapper.TeamJoinRequestMapper;
import com.hackhive.team.repository.TeamJoinRequestRepository;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import com.hackhive.team.service.TeamJoinRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamJoinRequestServiceImpl
        implements TeamJoinRequestService {

    private final TeamJoinRequestRepository teamJoinRequestRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final TeamJoinRequestMapper teamJoinRequestMapper;

    private StudentProfile getCurrentStudentProfile() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."));

        return studentProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found."));
    }

    @Override
    @Transactional
    public TeamJoinRequestResponse sendJoinRequest(
            Long teamId) {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        Team team = teamRepository
                .findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found."));

        if (!team.getOpen()) {
            throw new BadRequestException(
                    "This team is not accepting join requests.");
        }

        if (teamMemberRepository
                .existsByTeamAndStudentProfile(
                        team,
                        studentProfile)) {

            throw new BadRequestException(
                    "You are already a member of this team.");
        }

        long currentMembers =
                teamMemberRepository.countByTeam(team);

        if (currentMembers >= team.getMaxMembers()) {
            throw new BadRequestException(
                    "This team is already full.");
        }

        TeamJoinRequest existingRequest =
                teamJoinRequestRepository
                        .findByTeamAndStudentProfile(
                                team,
                                studentProfile)
                        .orElse(null);

        if (existingRequest != null) {

            if ("PENDING".equals(
                    existingRequest.getStatus())) {

                throw new BadRequestException(
                        "You already have a pending join request.");
            }

            if ("APPROVED".equals(
                    existingRequest.getStatus())) {

                throw new BadRequestException(
                        "Your join request has already been approved.");
            }

            // Allow student to send another request
            // after a previous rejection
            existingRequest.setStatus("PENDING");

            existingRequest =
                    teamJoinRequestRepository
                            .save(existingRequest);

            return teamJoinRequestMapper
                    .toResponse(existingRequest);
        }

        TeamJoinRequest joinRequest =
                TeamJoinRequest.builder()
                        .team(team)
                        .studentProfile(studentProfile)
                        .status("PENDING")
                        .build();

        joinRequest =
                teamJoinRequestRepository.save(joinRequest);

        return teamJoinRequestMapper
                .toResponse(joinRequest);
    }

    @Override
    public List<TeamJoinRequestResponse> getMyJoinRequests() {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        return teamJoinRequestRepository
                .findByStudentProfile(studentProfile)
                .stream()
                .map(teamJoinRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void cancelJoinRequest(Long requestId) {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        TeamJoinRequest joinRequest =
                teamJoinRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Join request not found."));

        if (!joinRequest
                .getStudentProfile()
                .getId()
                .equals(studentProfile.getId())) {

            throw new BadRequestException(
                    "You cannot cancel another student's join request.");
        }

        if (!"PENDING".equals(
                joinRequest.getStatus())) {

            throw new BadRequestException(
                    "Only pending join requests can be cancelled.");
        }

        teamJoinRequestRepository.delete(joinRequest);
    }

    @Override
    public List<TeamJoinRequestResponse> getTeamJoinRequests(
            Long teamId) {

        StudentProfile leader =
                getCurrentStudentProfile();

        Team team = teamRepository
                .findByIdAndLeader(teamId, leader)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found or you are not the team leader."));

        return teamJoinRequestRepository
                .findByTeamAndStatus(
                        team,
                        "PENDING")
                .stream()
                .map(teamJoinRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public TeamJoinRequestResponse approveJoinRequest(
            Long requestId) {

        StudentProfile leader =
                getCurrentStudentProfile();

        TeamJoinRequest joinRequest =
                teamJoinRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Join request not found."));

        Team team = joinRequest.getTeam();

        if (!team.getLeader()
                .getId()
                .equals(leader.getId())) {

            throw new BadRequestException(
                    "Only the team leader can approve join requests.");
        }

        if (!"PENDING".equals(
                joinRequest.getStatus())) {

            throw new BadRequestException(
                    "This join request is not pending.");
        }

        long currentMembers =
                teamMemberRepository.countByTeam(team);

        if (currentMembers >= team.getMaxMembers()) {
            throw new BadRequestException(
                    "The team is already full.");
        }

        StudentProfile student =
                joinRequest.getStudentProfile();

        if (teamMemberRepository
                .existsByTeamAndStudentProfile(
                        team,
                        student)) {

            throw new BadRequestException(
                    "Student is already a member of the team.");
        }

        TeamMember teamMember =
                TeamMember.builder()
                        .team(team)
                        .studentProfile(student)
                        .role("MEMBER")
                        .build();

        teamMemberRepository.save(teamMember);

        joinRequest.setStatus("APPROVED");

        joinRequest =
                teamJoinRequestRepository
                        .save(joinRequest);

        // Automatically close team when it becomes full
        if (teamMemberRepository.countByTeam(team)
                >= team.getMaxMembers()) {

            team.setOpen(false);
            teamRepository.save(team);
        }

        return teamJoinRequestMapper
                .toResponse(joinRequest);
    }

    @Override
    @Transactional
    public TeamJoinRequestResponse rejectJoinRequest(
            Long requestId) {

        StudentProfile leader =
                getCurrentStudentProfile();

        TeamJoinRequest joinRequest =
                teamJoinRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Join request not found."));

        Team team = joinRequest.getTeam();

        if (!team.getLeader()
                .getId()
                .equals(leader.getId())) {

            throw new BadRequestException(
                    "Only the team leader can reject join requests.");
        }

        if (!"PENDING".equals(
                joinRequest.getStatus())) {

            throw new BadRequestException(
                    "This join request is not pending.");
        }

        joinRequest.setStatus("REJECTED");

        joinRequest =
                teamJoinRequestRepository
                        .save(joinRequest);

        return teamJoinRequestMapper
                .toResponse(joinRequest);
    }
}