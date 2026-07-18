package com.hackhive.team.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.entity.Event;
import com.hackhive.event.repository.EventRepository;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.dto.request.CreateTeamRequest;
import com.hackhive.team.dto.request.UpdateTeamRequest;
import com.hackhive.team.dto.response.TeamMemberResponse;
import com.hackhive.team.dto.response.TeamResponse;
import com.hackhive.team.entity.Team;
import com.hackhive.team.entity.TeamMember;
import com.hackhive.team.mapper.TeamMapper;
import com.hackhive.team.mapper.TeamMemberMapper;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import com.hackhive.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EventRepository eventRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final TeamMapper teamMapper;
    private final TeamMemberMapper teamMemberMapper;

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
    public TeamResponse createTeam(
            CreateTeamRequest request) {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        Event event = eventRepository
                .findById(request.getEventId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        if (request.getMaxMembers() < 1) {
            throw new BadRequestException(
                    "Maximum members must be at least 1.");
        }

        // Do not allow a team size larger than
        // the event's configured maximum team size
        if (event.getMaxTeamSize() != null
                && request.getMaxMembers()
                > event.getMaxTeamSize()) {

            throw new BadRequestException(
                    "Team maximum members cannot exceed "
                            + "the event maximum team size.");
        }

        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .event(event)
                .leader(studentProfile)
                .collegeName(request.getCollegeName())
                .maxMembers(request.getMaxMembers())
                .open(true)
                .build();

        team = teamRepository.save(team);

        // Automatically add creator as team leader
        TeamMember leaderMember =
                TeamMember.builder()
                        .team(team)
                        .studentProfile(studentProfile)
                        .role("LEADER")
                        .build();

        teamMemberRepository.save(leaderMember);

        return teamMapper.toResponse(team);
    }

    @Override
    public TeamResponse updateTeam(
            Long teamId,
            UpdateTeamRequest request) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team = teamRepository
                .findByIdAndLeader(
                        teamId,
                        currentStudent)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found or you are not the team leader."));

        long currentMembers =
                teamMemberRepository.countByTeam(team);

        if (request.getMaxMembers() < currentMembers) {
            throw new BadRequestException(
                    "Maximum members cannot be less than "
                            + "the current number of team members.");
        }

        if (team.getEvent().getMaxTeamSize() != null
                && request.getMaxMembers()
                > team.getEvent().getMaxTeamSize()) {

            throw new BadRequestException(
                    "Team maximum members cannot exceed "
                            + "the event maximum team size.");
        }

        team.setName(request.getName());
        team.setDescription(request.getDescription());
        team.setCollegeName(request.getCollegeName());
        team.setMaxMembers(request.getMaxMembers());
        team.setOpen(request.getOpen());

        team = teamRepository.save(team);

        return teamMapper.toResponse(team);
    }

    @Override
    @Transactional
    public void deleteTeam(Long teamId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team = teamRepository
                .findByIdAndLeader(
                        teamId,
                        currentStudent)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found or you are not the team leader."));

        teamRepository.delete(team);
    }

    @Override
    public TeamResponse getTeamById(Long teamId) {

        Team team = teamRepository
                .findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found."));

        return teamMapper.toResponse(team);
    }

    @Override
    public List<TeamResponse> getAllTeams() {

        return teamRepository
                .findAll()
                .stream()
                .map(teamMapper::toResponse)
                .toList();
    }

    @Override
    public List<TeamResponse> searchTeamsByName(
            String name) {

        return teamRepository
                .findByNameContainingIgnoreCase(name)
                .stream()
                .map(teamMapper::toResponse)
                .toList();
    }

    @Override
    public List<TeamResponse> searchTeamsByCollege(
            String collegeName) {

        return teamRepository
                .findByCollegeNameContainingIgnoreCase(
                        collegeName)
                .stream()
                .map(teamMapper::toResponse)
                .toList();
    }

    @Override
    public List<TeamResponse> getTeamsByEvent(
            Long eventId) {

        Event event = eventRepository
                .findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        return teamRepository
                .findByEvent(event)
                .stream()
                .map(teamMapper::toResponse)
                .toList();
    }

    @Override
    public List<TeamResponse> getOpenTeams() {

        return teamRepository
                .findByOpenTrue()
                .stream()
                .map(teamMapper::toResponse)
                .toList();
    }

    @Override
    public List<TeamResponse> getMyTeams() {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        return teamMemberRepository
                .findByStudentProfile(studentProfile)
                .stream()
                .map(TeamMember::getTeam)
                .map(teamMapper::toResponse)
                .toList();
    }

    @Override
    public List<TeamMemberResponse> getTeamMembers(
            Long teamId) {

        Team team = teamRepository
                .findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found."));

        return teamMemberRepository
                .findByTeam(team)
                .stream()
                .map(teamMemberMapper::toResponse)
                .toList();
    }
}