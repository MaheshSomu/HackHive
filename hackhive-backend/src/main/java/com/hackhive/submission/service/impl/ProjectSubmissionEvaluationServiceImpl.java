package com.hackhive.submission.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.entity.Event;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.submission.dto.request.CreateUpdateEvaluationRequest;
import com.hackhive.submission.dto.response.ProjectSubmissionEvaluationResponse;
import com.hackhive.submission.entity.ProjectSubmission;
import com.hackhive.submission.entity.ProjectSubmissionEvaluation;
import com.hackhive.submission.enums.ProjectEvaluationStatus;
import com.hackhive.submission.enums.ProjectSubmissionStatus;
import com.hackhive.submission.mapper.ProjectSubmissionEvaluationMapper;
import com.hackhive.submission.repository.ProjectSubmissionEvaluationRepository;
import com.hackhive.submission.repository.ProjectSubmissionRepository;
import com.hackhive.submission.service.ProjectSubmissionEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectSubmissionEvaluationServiceImpl implements ProjectSubmissionEvaluationService {

    private final ProjectSubmissionEvaluationRepository evaluationRepository;
    private final ProjectSubmissionRepository submissionRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final ProjectSubmissionEvaluationMapper evaluationMapper;

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

    private void validateScoreRange(Integer score, String scoreName) {
        if (score != null && (score < 0 || score > 10)) {
            throw new BadRequestException(scoreName + " must be between 0 and 10.");
        }
    }

    private int calculateTotalScore(Integer innovation, Integer tech, Integer problem, Integer uiUx, Integer impact) {
        int total = 0;
        if (innovation != null) total += innovation;
        if (tech != null) total += tech;
        if (problem != null) total += problem;
        if (uiUx != null) total += uiUx;
        if (impact != null) total += impact;
        return total;
    }

    @Override
    @Transactional
    public ProjectSubmissionEvaluationResponse saveEvaluationDraft(Long submissionId, CreateUpdateEvaluationRequest request) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        ProjectSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Project submission not found."));

        if (submission.getSubmissionStatus() != ProjectSubmissionStatus.SUBMITTED) {
            throw new BadRequestException("Cannot evaluate a draft project submission.");
        }

        Event event = submission.getEvent();
        if (!event.getOrganizerProfile().getId().equals(organizerProfile.getId())) {
            throw new BadRequestException("You do not have permission to evaluate project submissions for this event.");
        }

        validateScoreRange(request.getInnovationScore(), "Innovation score");
        validateScoreRange(request.getTechnicalImplementationScore(), "Technical implementation score");
        validateScoreRange(request.getProblemRelevanceScore(), "Problem relevance score");
        validateScoreRange(request.getUiUxScore(), "UI/UX score");
        validateScoreRange(request.getImpactScore(), "Impact score");

        Optional<ProjectSubmissionEvaluation> existingOpt = evaluationRepository.findByProjectSubmissionId(submissionId);

        ProjectSubmissionEvaluation evaluation;
        if (existingOpt.isPresent()) {
            evaluation = existingOpt.get();
            if (evaluation.getStatus() == ProjectEvaluationStatus.FINALIZED) {
                throw new BadRequestException("Finalized evaluations cannot be modified.");
            }
        } else {
            evaluation = ProjectSubmissionEvaluation.builder()
                    .projectSubmission(submission)
                    .organizerProfile(organizerProfile)
                    .status(ProjectEvaluationStatus.DRAFT)
                    .build();
        }

        evaluation.setInnovationScore(request.getInnovationScore());
        evaluation.setTechnicalImplementationScore(request.getTechnicalImplementationScore());
        evaluation.setProblemRelevanceScore(request.getProblemRelevanceScore());
        evaluation.setUiUxScore(request.getUiUxScore());
        evaluation.setImpactScore(request.getImpactScore());
        evaluation.setReviewComment(request.getReviewComment());

        evaluation.setTotalScore(calculateTotalScore(
                request.getInnovationScore(),
                request.getTechnicalImplementationScore(),
                request.getProblemRelevanceScore(),
                request.getUiUxScore(),
                request.getImpactScore()
        ));

        ProjectSubmissionEvaluation saved = evaluationRepository.save(evaluation);

        return evaluationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectSubmissionEvaluationResponse getEvaluationBySubmissionId(Long submissionId) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        ProjectSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Project submission not found."));

        if (submission.getSubmissionStatus() != ProjectSubmissionStatus.SUBMITTED) {
            throw new ResourceNotFoundException("No evaluation found for this project submission.");
        }

        Event event = submission.getEvent();
        if (!event.getOrganizerProfile().getId().equals(organizerProfile.getId())) {
            throw new BadRequestException("You do not have permission to view evaluation for this event.");
        }

        ProjectSubmissionEvaluation evaluation = evaluationRepository.findByProjectSubmissionId(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("No evaluation found for this project submission."));

        return evaluationMapper.toResponse(evaluation);
    }

    @Override
    @Transactional
    public ProjectSubmissionEvaluationResponse updateEvaluationDraft(Long evaluationId, CreateUpdateEvaluationRequest request) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        ProjectSubmissionEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found."));

        Event event = evaluation.getProjectSubmission().getEvent();
        if (!event.getOrganizerProfile().getId().equals(organizerProfile.getId())) {
            throw new BadRequestException("You do not have permission to update evaluation for this event.");
        }

        if (evaluation.getStatus() == ProjectEvaluationStatus.FINALIZED) {
            throw new BadRequestException("Finalized evaluations cannot be modified.");
        }

        validateScoreRange(request.getInnovationScore(), "Innovation score");
        validateScoreRange(request.getTechnicalImplementationScore(), "Technical implementation score");
        validateScoreRange(request.getProblemRelevanceScore(), "Problem relevance score");
        validateScoreRange(request.getUiUxScore(), "UI/UX score");
        validateScoreRange(request.getImpactScore(), "Impact score");

        evaluation.setInnovationScore(request.getInnovationScore());
        evaluation.setTechnicalImplementationScore(request.getTechnicalImplementationScore());
        evaluation.setProblemRelevanceScore(request.getProblemRelevanceScore());
        evaluation.setUiUxScore(request.getUiUxScore());
        evaluation.setImpactScore(request.getImpactScore());
        evaluation.setReviewComment(request.getReviewComment());

        evaluation.setTotalScore(calculateTotalScore(
                request.getInnovationScore(),
                request.getTechnicalImplementationScore(),
                request.getProblemRelevanceScore(),
                request.getUiUxScore(),
                request.getImpactScore()
        ));

        ProjectSubmissionEvaluation updated = evaluationRepository.save(evaluation);

        return evaluationMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public ProjectSubmissionEvaluationResponse finalizeEvaluation(Long evaluationId) {
        OrganizerProfile organizerProfile = getCurrentOrganizerProfile();

        ProjectSubmissionEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found."));

        Event event = evaluation.getProjectSubmission().getEvent();
        if (!event.getOrganizerProfile().getId().equals(organizerProfile.getId())) {
            throw new BadRequestException("You do not have permission to finalize evaluation for this event.");
        }

        if (evaluation.getStatus() == ProjectEvaluationStatus.FINALIZED) {
            throw new BadRequestException("Evaluation is already finalized.");
        }

        if (evaluation.getInnovationScore() == null ||
            evaluation.getTechnicalImplementationScore() == null ||
            evaluation.getProblemRelevanceScore() == null ||
            evaluation.getUiUxScore() == null ||
            evaluation.getImpactScore() == null) {
            throw new BadRequestException("All five judging criteria scores (Innovation, Technical Implementation, Problem Relevance, UI/UX, Impact) must be provided before finalization.");
        }

        evaluation.setTotalScore(calculateTotalScore(
                evaluation.getInnovationScore(),
                evaluation.getTechnicalImplementationScore(),
                evaluation.getProblemRelevanceScore(),
                evaluation.getUiUxScore(),
                evaluation.getImpactScore()
        ));

        evaluation.setStatus(ProjectEvaluationStatus.FINALIZED);
        evaluation.setFinalizedAt(LocalDateTime.now());

        ProjectSubmissionEvaluation finalized = evaluationRepository.save(evaluation);

        return evaluationMapper.toResponse(finalized);
    }
}
