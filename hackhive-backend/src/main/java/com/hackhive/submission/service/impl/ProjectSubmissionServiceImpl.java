package com.hackhive.submission.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.entity.Event;
import com.hackhive.event.entity.EventRegistration;
import com.hackhive.event.enums.RegistrationStatus;
import com.hackhive.event.repository.EventRegistrationRepository;
import com.hackhive.event.repository.EventRepository;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.submission.dto.request.CreateProjectSubmissionRequest;
import com.hackhive.submission.dto.request.UpdateProjectSubmissionRequest;
import com.hackhive.submission.dto.response.ProjectSubmissionResponse;
import com.hackhive.submission.entity.ProjectSubmission;
import com.hackhive.submission.enums.ProjectSubmissionStatus;
import com.hackhive.submission.mapper.ProjectSubmissionMapper;
import com.hackhive.submission.repository.ProjectSubmissionRepository;
import com.hackhive.submission.service.ProjectSubmissionService;
import com.hackhive.team.entity.Team;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectSubmissionServiceImpl implements ProjectSubmissionService {

    private final ProjectSubmissionRepository projectSubmissionRepository;
    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final ProjectSubmissionMapper projectSubmissionMapper;

    private StudentProfile getCurrentStudentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Unauthenticated request.");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found."));
    }

    @Override
    @Transactional
    public ProjectSubmissionResponse createDraft(CreateProjectSubmissionRequest request) {
        StudentProfile studentProfile = getCurrentStudentProfile();

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found."));

        // Verify team belongs to requested event
        if (!team.getEvent().getId().equals(event.getId())) {
            throw new BadRequestException("Requested team does not belong to the specified event.");
        }

        // Only team leader can create official submission
        if (!team.getLeader().getId().equals(studentProfile.getId())) {
            throw new BadRequestException("Only the team leader can create the project submission.");
        }

        // Verify student belongs to correct event registration
        Optional<EventRegistration> registrationOpt =
                eventRegistrationRepository.findByEventAndStudentProfile(event, studentProfile);

        if (registrationOpt.isEmpty() || registrationOpt.get().getStatus() != RegistrationStatus.CONFIRMED) {
            throw new BadRequestException("Student must have a confirmed event registration to submit a project.");
        }

        // Duplicate submission protection
        if (projectSubmissionRepository.existsByTeamId(team.getId())) {
            throw new BadRequestException("A project submission already exists for this team.");
        }

        ProjectSubmission submission = ProjectSubmission.builder()
                .event(event)
                .team(team)
                .submittedBy(studentProfile)
                .projectTitle(request.getProjectTitle())
                .problemStatement(request.getProblemStatement())
                .projectDescription(request.getProjectDescription())
                .technologiesUsed(request.getTechnologiesUsed())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .presentationUrl(request.getPresentationUrl())
                .submissionStatus(ProjectSubmissionStatus.DRAFT)
                .submittedAt(null)
                .build();

        ProjectSubmission savedSubmission = projectSubmissionRepository.save(submission);

        return projectSubmissionMapper.toResponse(savedSubmission);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectSubmissionResponse getSubmissionByTeam(Long teamId) {
        StudentProfile studentProfile = getCurrentStudentProfile();

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found."));

        boolean isLeader = team.getLeader().getId().equals(studentProfile.getId());
        boolean isMember = isLeader || teamMemberRepository.existsByTeamAndStudentProfile(team, studentProfile);

        if (!isMember) {
            throw new BadRequestException("You must be a member of this team to view its submission.");
        }

        ProjectSubmission submission = projectSubmissionRepository.findByTeamId(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("No project submission found for this team."));

        return projectSubmissionMapper.toResponse(submission);
    }

    @Override
    @Transactional
    public ProjectSubmissionResponse updateDraft(Long submissionId, UpdateProjectSubmissionRequest request) {
        StudentProfile studentProfile = getCurrentStudentProfile();

        ProjectSubmission submission = projectSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Project submission not found."));

        // Only team leader can update submission
        if (!submission.getTeam().getLeader().getId().equals(studentProfile.getId())) {
            throw new BadRequestException("Only the team leader can update the project submission.");
        }

        // Submitted projects cannot be updated
        if (submission.getSubmissionStatus() != ProjectSubmissionStatus.DRAFT) {
            throw new BadRequestException("Submitted projects cannot be modified.");
        }

        submission.setProjectTitle(request.getProjectTitle());
        submission.setProblemStatement(request.getProblemStatement());
        submission.setProjectDescription(request.getProjectDescription());
        submission.setTechnologiesUsed(request.getTechnologiesUsed());
        submission.setGithubUrl(request.getGithubUrl());
        submission.setDemoUrl(request.getDemoUrl());
        submission.setPresentationUrl(request.getPresentationUrl());

        ProjectSubmission updatedSubmission = projectSubmissionRepository.save(submission);

        return projectSubmissionMapper.toResponse(updatedSubmission);
    }

    @Override
    @Transactional
    public ProjectSubmissionResponse submitProject(Long submissionId) {
        StudentProfile studentProfile = getCurrentStudentProfile();

        ProjectSubmission submission = projectSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Project submission not found."));

        // Only team leader can finalize submission
        if (!submission.getTeam().getLeader().getId().equals(studentProfile.getId())) {
            throw new BadRequestException("Only the team leader can finalize and submit the project.");
        }

        // Submitted projects cannot be re-submitted
        if (submission.getSubmissionStatus() != ProjectSubmissionStatus.DRAFT) {
            throw new BadRequestException("Project has already been submitted.");
        }

        if (submission.getProjectTitle() == null || submission.getProjectTitle().trim().isEmpty() ||
            submission.getProblemStatement() == null || submission.getProblemStatement().trim().isEmpty() ||
            submission.getProjectDescription() == null || submission.getProjectDescription().trim().isEmpty()) {
            throw new BadRequestException("Project title, problem statement, and description must be completed before submission.");
        }

        submission.setSubmissionStatus(ProjectSubmissionStatus.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.now());

        ProjectSubmission finalizedSubmission = projectSubmissionRepository.save(submission);

        return projectSubmissionMapper.toResponse(finalizedSubmission);
    }

    private OrganizerProfile getCurrentOrganizerProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Unauthenticated request.");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return organizerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer profile not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSubmissionResponse> getEventSubmissionsForOrganizer(Long eventId) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));

        if (!event.getOrganizerProfile().getId().equals(organizerProfile.getId())) {
            throw new BadRequestException("You do not have permission to view project submissions for this event.");
        }

        List<ProjectSubmission> submissions = projectSubmissionRepository.findByEventIdAndSubmissionStatusOrderByCreatedAtDesc(eventId, ProjectSubmissionStatus.SUBMITTED);

        return submissions.stream()
                .map(projectSubmissionMapper::toResponse)
                .collect(Collectors.toList());
    }
}
