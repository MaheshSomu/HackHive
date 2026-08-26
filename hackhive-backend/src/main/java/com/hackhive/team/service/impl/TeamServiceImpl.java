package com.hackhive.team.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.entity.Event;
import com.hackhive.event.repository.EventRegistrationRepository;
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
import com.hackhive.team.repository.TeamJoinRequestRepository;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import com.hackhive.team.service.TeamService;
import com.hackhive.workspace.repository.ChatMessageRepository;
import com.hackhive.workspace.repository.KanbanTaskRepository;
import com.hackhive.workspace.repository.TeamResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hackhive.event.entity.EventRegistration;
import com.hackhive.event.enums.RegistrationStatus;

import java.util.List;
import java.util.Optional;

import com.hackhive.team.entity.ExternalEvent;
import com.hackhive.team.enums.EventType;
import com.hackhive.team.repository.ExternalEventRepository;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamJoinRequestRepository teamJoinRequestRepository;
    private final TeamResourceRepository teamResourceRepository;
    private final KanbanTaskRepository kanbanTaskRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final ExternalEventRepository externalEventRepository;
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
    public TeamResponse createTeam(CreateTeamRequest request) {
        StudentProfile studentProfile = getCurrentStudentProfile();

        if (request.getMaxMembers() != null && request.getMaxMembers() < 1) {
            throw new BadRequestException("Maximum members must be at least 1.");
        }

        EventType eventType = request.getEventType();
        if (eventType == null) {
            if (request.getEventId() != null) {
                eventType = EventType.HACKHIVE;
            } else if (request.getExternalEventName() != null) {
                eventType = EventType.EXTERNAL;
            } else {
                throw new BadRequestException("Either a HackHive event or external event details must be provided.");
            }
        }

        Team team;

        if (eventType == EventType.EXTERNAL) {
            if (request.getEventId() != null) {
                throw new BadRequestException("Cannot specify a HackHive event ID for an external event team.");
            }
            if (request.getExternalEventName() == null || request.getExternalEventName().trim().isEmpty()) {
                throw new BadRequestException("External event name is required.");
            }
            if (request.getExternalOrganizerName() == null || request.getExternalOrganizerName().trim().isEmpty()) {
                throw new BadRequestException("External event organizer name is required.");
            }

            ExternalEvent externalEvent = ExternalEvent.builder()
                    .eventName(request.getExternalEventName().trim())
                    .organizerName(request.getExternalOrganizerName().trim())
                    .eventDate(request.getExternalEventDate() != null ? request.getExternalEventDate().trim() : null)
                    .description(request.getExternalDescription() != null ? request.getExternalDescription().trim() : null)
                    .build();
            externalEvent = externalEventRepository.save(externalEvent);

            team = Team.builder()
                    .name(request.getName().trim())
                    .description(request.getDescription() != null ? request.getDescription().trim() : null)
                    .event(null)
                    .externalEvent(externalEvent)
                    .eventType(EventType.EXTERNAL)
                    .leader(studentProfile)
                    .collegeName(request.getCollegeName() != null ? request.getCollegeName().trim() : null)
                    .maxMembers(request.getMaxMembers() != null ? request.getMaxMembers() : 4)
                    .open(true)
                    .build();
        } else {
            // HACKHIVE Event Team Flow
            if (request.getEventId() == null) {
                throw new BadRequestException("Event ID is required for HackHive event teams.");
            }
            if (request.getExternalEventName() != null && !request.getExternalEventName().trim().isEmpty()) {
                throw new BadRequestException("Cannot specify external event details for a HackHive event team.");
            }

            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found."));

            Optional<EventRegistration> registrationOpt = eventRegistrationRepository
                    .findByEventAndStudentProfile(event, studentProfile);

            if (registrationOpt.isEmpty() || registrationOpt.get().getStatus() != RegistrationStatus.CONFIRMED) {
                throw new BadRequestException("You must complete confirmed registration before creating a team for this event.");
            }

            if (event.getMaxTeamSize() != null && request.getMaxMembers() > event.getMaxTeamSize()) {
                throw new BadRequestException("Team maximum members cannot exceed the event maximum team size.");
            }

            boolean alreadyInEventTeam = teamMemberRepository.existsByStudentProfileAndTeam_Event(studentProfile, event);
            if (alreadyInEventTeam) {
                throw new BadRequestException("You are already a member of a team for this event.");
            }

            team = Team.builder()
                    .name(request.getName().trim())
                    .description(request.getDescription() != null ? request.getDescription().trim() : null)
                    .event(event)
                    .externalEvent(null)
                    .eventType(EventType.HACKHIVE)
                    .leader(studentProfile)
                    .collegeName(request.getCollegeName() != null ? request.getCollegeName().trim() : null)
                    .maxMembers(request.getMaxMembers() != null ? request.getMaxMembers() : 4)
                    .open(true)
                    .build();
        }

        team = teamRepository.save(team);

        // Automatically add creator as team leader
        TeamMember leaderMember = TeamMember.builder()
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

        if (team.getEvent() != null
                && team.getEvent().getMaxTeamSize() != null
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

        teamJoinRequestRepository.deleteByTeam(team);
        teamMemberRepository.deleteByTeam(team);
        teamResourceRepository.deleteByTeam(team);
        kanbanTaskRepository.deleteByTeam(team);
        chatMessageRepository.deleteByTeam(team);

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