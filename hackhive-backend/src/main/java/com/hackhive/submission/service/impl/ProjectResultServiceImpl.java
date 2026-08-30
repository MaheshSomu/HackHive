package com.hackhive.submission.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.entity.Event;
import com.hackhive.event.repository.EventRepository;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.submission.dto.request.ConfigureProjectResultRequest;
import com.hackhive.submission.dto.request.UpdateProjectResultRequest;
import com.hackhive.submission.dto.response.ProjectResultResponse;
import com.hackhive.submission.entity.ProjectResult;
import com.hackhive.submission.entity.ProjectSubmission;
import com.hackhive.submission.entity.ProjectSubmissionEvaluation;
import com.hackhive.submission.enums.ProjectEvaluationStatus;
import com.hackhive.submission.enums.ProjectResultStatus;
import com.hackhive.submission.enums.ProjectSubmissionStatus;
import com.hackhive.submission.mapper.ProjectResultMapper;
import com.hackhive.submission.repository.ProjectResultRepository;
import com.hackhive.submission.repository.ProjectSubmissionEvaluationRepository;
import com.hackhive.submission.repository.ProjectSubmissionRepository;
import com.hackhive.submission.service.ProjectResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectResultServiceImpl implements ProjectResultService {

    private final ProjectResultRepository resultRepository;
    private final ProjectSubmissionRepository submissionRepository;
    private final ProjectSubmissionEvaluationRepository evaluationRepository;
    private final EventRepository eventRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final ProjectResultMapper resultMapper;

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

    private void checkOrganizerEventOwnership(Event event, OrganizerProfile organizerProfile) {
        if (!event.getOrganizerProfile().getId().equals(organizerProfile.getId())) {
            throw new BadRequestException("You do not have permission to manage results for this event.");
        }
    }

    private void validateRankUniqueness(Long eventId, Integer rank, Long currentResultId) {
        if (rank == null) return;

        List<ProjectResult> existing = resultRepository.findByEventId(eventId);
        for (ProjectResult r : existing) {
            if (!r.getId().equals(currentResultId) && rank.equals(r.getRank())) {
                throw new BadRequestException("Rank " + rank + " is already assigned to another team in this event.");
            }
        }
    }

    @Override
    @Transactional
    public ProjectResultResponse configureResult(Long eventId, ConfigureProjectResultRequest request) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));
        checkOrganizerEventOwnership(event, organizerProfile);

        ProjectSubmission submission = submissionRepository.findById(request.getProjectSubmissionId())
                .orElseThrow(() -> new ResourceNotFoundException("Project submission not found."));

        if (!submission.getEvent().getId().equals(eventId)) {
            throw new BadRequestException("Project submission does not belong to this event.");
        }

        if (submission.getSubmissionStatus() != ProjectSubmissionStatus.SUBMITTED) {
            throw new BadRequestException("Only SUBMITTED project entries can be configured in results.");
        }

        ProjectSubmissionEvaluation evaluation = evaluationRepository.findByProjectSubmissionId(submission.getId())
                .orElseThrow(() -> new BadRequestException("Project submission must have an evaluation before configuring results."));

        if (evaluation.getStatus() != ProjectEvaluationStatus.FINALIZED) {
            throw new BadRequestException("Project submission evaluation must be FINALIZED before configuring results.");
        }

        Optional<ProjectResult> existingOpt = resultRepository.findByProjectSubmissionId(submission.getId());
        ProjectResult result;
        if (existingOpt.isPresent()) {
            result = existingOpt.get();
        } else {
            result = ProjectResult.builder()
                    .event(event)
                    .projectSubmission(submission)
                    .status(ProjectResultStatus.DRAFT)
                    .build();
        }

        validateRankUniqueness(eventId, request.getRank(), result.getId());

        String cleanedAward = request.getAwardTitle() != null ? request.getAwardTitle().trim() : null;
        if (cleanedAward != null && cleanedAward.isEmpty()) {
            cleanedAward = null;
        }

        result.setRank(request.getRank());
        result.setAwardTitle(cleanedAward);

        ProjectResult saved = resultRepository.save(result);

        return resultMapper.toResponse(saved, evaluation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResultResponse> getEventLeaderboardForOrganizer(Long eventId) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));
        checkOrganizerEventOwnership(event, organizerProfile);

        List<ProjectSubmission> submissions = submissionRepository.findByEventIdAndSubmissionStatusOrderByCreatedAtDesc(eventId, ProjectSubmissionStatus.SUBMITTED);

        List<ProjectResultResponse> leaderboard = new ArrayList<>();

        for (ProjectSubmission submission : submissions) {
            if (submission.getSubmissionStatus() != ProjectSubmissionStatus.SUBMITTED) {
                continue;
            }

            Optional<ProjectSubmissionEvaluation> evalOpt = evaluationRepository.findByProjectSubmissionId(submission.getId());
            ProjectSubmissionEvaluation evaluation = evalOpt.orElse(null);

            Optional<ProjectResult> resultOpt = resultRepository.findByProjectSubmissionId(submission.getId());
            ProjectResult result = resultOpt.orElse(null);

            if (result != null) {
                leaderboard.add(resultMapper.toResponse(result, evaluation));
            } else {
                // Synthetic response for organizer overview
                leaderboard.add(ProjectResultResponse.builder()
                        .eventId(event.getId())
                        .eventTitle(event.getTitle())
                        .projectSubmissionId(submission.getId())
                        .projectTitle(submission.getProjectTitle())
                        .teamId(submission.getTeam() != null ? submission.getTeam().getId() : null)
                        .teamName(submission.getTeam() != null ? submission.getTeam().getName() : null)
                        .submittedByName(submission.getSubmittedBy() != null && submission.getSubmittedBy().getUser() != null ? submission.getSubmittedBy().getUser().getFullName() : null)
                        .totalScore(evaluation != null ? evaluation.getTotalScore() : 0)
                        .maxScore(50)
                        .innovationScore(evaluation != null ? evaluation.getInnovationScore() : null)
                        .technicalImplementationScore(evaluation != null ? evaluation.getTechnicalImplementationScore() : null)
                        .problemRelevanceScore(evaluation != null ? evaluation.getProblemRelevanceScore() : null)
                        .uiUxScore(evaluation != null ? evaluation.getUiUxScore() : null)
                        .impactScore(evaluation != null ? evaluation.getImpactScore() : null)
                        .reviewComment(evaluation != null ? evaluation.getReviewComment() : null)
                        .evaluationStatus(evaluation != null ? evaluation.getStatus() : null)
                        .status(ProjectResultStatus.DRAFT)
                        .build());
            }
        }

        // Deterministic sorting
        leaderboard.sort((a, b) -> {
            if (a.getRank() != null && b.getRank() != null) {
                return Integer.compare(a.getRank(), b.getRank());
            }
            if (a.getRank() != null) return -1;
            if (b.getRank() != null) return 1;

            int scoreComp = Integer.compare(b.getTotalScore() != null ? b.getTotalScore() : 0,
                    a.getTotalScore() != null ? a.getTotalScore() : 0);
            if (scoreComp != 0) return scoreComp;

            return Long.compare(a.getProjectSubmissionId(), b.getProjectSubmissionId());
        });

        return leaderboard;
    }

    @Override
    @Transactional
    public ProjectResultResponse updateResult(Long resultId, UpdateProjectResultRequest request) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        ProjectResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Project result not found."));

        checkOrganizerEventOwnership(result.getEvent(), organizerProfile);

        validateRankUniqueness(result.getEvent().getId(), request.getRank(), result.getId());

        String cleanedAward = request.getAwardTitle() != null ? request.getAwardTitle().trim() : null;
        if (cleanedAward != null && cleanedAward.isEmpty()) {
            cleanedAward = null;
        }

        result.setRank(request.getRank());
        result.setAwardTitle(cleanedAward);

        ProjectResult saved = resultRepository.save(result);

        ProjectSubmissionEvaluation evaluation = evaluationRepository
                .findByProjectSubmissionId(saved.getProjectSubmission().getId()).orElse(null);

        return resultMapper.toResponse(saved, evaluation);
    }

    @Override
    @Transactional
    public ProjectResultResponse publishResult(Long resultId) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        ProjectResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Project result not found."));

        checkOrganizerEventOwnership(result.getEvent(), organizerProfile);

        ProjectSubmissionEvaluation evaluation = evaluationRepository
                .findByProjectSubmissionId(result.getProjectSubmission().getId())
                .orElseThrow(() -> new BadRequestException("Evaluation is missing for this project submission."));

        if (evaluation.getStatus() != ProjectEvaluationStatus.FINALIZED) {
            throw new BadRequestException("Cannot publish result because evaluation status is not FINALIZED.");
        }

        result.setStatus(ProjectResultStatus.PUBLISHED);
        result.setPublishedAt(LocalDateTime.now());

        ProjectResult saved = resultRepository.save(result);

        return resultMapper.toResponse(saved, evaluation);
    }

    @Override
    @Transactional
    public List<ProjectResultResponse> publishAllResultsForEvent(Long eventId) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));
        checkOrganizerEventOwnership(event, organizerProfile);

        List<ProjectResult> results = resultRepository.findByEventId(eventId);
        if (results.isEmpty()) {
            throw new BadRequestException("No configured project results found for this event to publish.");
        }

        List<ProjectResultResponse> publishedResponses = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (ProjectResult result : results) {
            ProjectSubmissionEvaluation evaluation = evaluationRepository
                    .findByProjectSubmissionId(result.getProjectSubmission().getId())
                    .orElse(null);

            if (evaluation == null || evaluation.getStatus() != ProjectEvaluationStatus.FINALIZED) {
                throw new BadRequestException("Cannot publish results. All configured projects must have FINALIZED evaluations.");
            }

            result.setStatus(ProjectResultStatus.PUBLISHED);
            result.setPublishedAt(now);
            ProjectResult saved = resultRepository.save(result);
            publishedResponses.add(resultMapper.toResponse(saved, evaluation));
        }

        return publishedResponses;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResultResponse> getPublishedResultsForEvent(Long eventId) {
        List<ProjectResult> publishedResults = resultRepository.findByEventIdAndStatus(eventId, ProjectResultStatus.PUBLISHED);

        List<ProjectResultResponse> responses = new ArrayList<>();

        for (ProjectResult result : publishedResults) {
            ProjectSubmissionEvaluation evaluation = evaluationRepository
                    .findByProjectSubmissionId(result.getProjectSubmission().getId())
                    .orElse(null);
            responses.add(resultMapper.toResponse(result, evaluation));
        }

        responses.sort((a, b) -> {
            if (a.getRank() != null && b.getRank() != null) {
                return Integer.compare(a.getRank(), b.getRank());
            }
            if (a.getRank() != null) return -1;
            if (b.getRank() != null) return 1;

            return Integer.compare(b.getTotalScore() != null ? b.getTotalScore() : 0,
                    a.getTotalScore() != null ? a.getTotalScore() : 0);
        });

        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResultResponse getPublishedResultForTeam(Long teamId) {
        Optional<ProjectSubmission> submissionOpt = submissionRepository.findByTeamId(teamId);
        if (submissionOpt.isEmpty()) {
            return null;
        }

        ProjectSubmission submission = submissionOpt.get();
        Optional<ProjectResult> resultOpt = resultRepository.findByProjectSubmissionId(submission.getId());

        if (resultOpt.isEmpty() || resultOpt.get().getStatus() != ProjectResultStatus.PUBLISHED) {
            return null;
        }

        ProjectSubmissionEvaluation evaluation = evaluationRepository
                .findByProjectSubmissionId(submission.getId())
                .orElse(null);

        return resultMapper.toResponse(resultOpt.get(), evaluation);
    }
}
