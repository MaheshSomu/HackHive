package com.hackhive.submission.mapper;

import com.hackhive.submission.dto.response.ProjectSubmissionEvaluationResponse;
import com.hackhive.submission.entity.ProjectSubmissionEvaluation;
import org.springframework.stereotype.Component;

@Component
public class ProjectSubmissionEvaluationMapper {

    public ProjectSubmissionEvaluationResponse toResponse(ProjectSubmissionEvaluation evaluation) {
        if (evaluation == null) {
            return null;
        }

        String organizerName = null;
        if (evaluation.getOrganizerProfile() != null && evaluation.getOrganizerProfile().getUser() != null) {
            organizerName = evaluation.getOrganizerProfile().getUser().getFullName();
        }

        return ProjectSubmissionEvaluationResponse.builder()
                .id(evaluation.getId())
                .projectSubmissionId(
                        evaluation.getProjectSubmission() != null ? evaluation.getProjectSubmission().getId() : null)
                .projectTitle(
                        evaluation.getProjectSubmission() != null ? evaluation.getProjectSubmission().getProjectTitle() : null)
                .teamId(
                        evaluation.getProjectSubmission() != null && evaluation.getProjectSubmission().getTeam() != null
                                ? evaluation.getProjectSubmission().getTeam().getId()
                                : null)
                .teamName(
                        evaluation.getProjectSubmission() != null && evaluation.getProjectSubmission().getTeam() != null
                                ? evaluation.getProjectSubmission().getTeam().getName()
                                : null)
                .organizerProfileId(
                        evaluation.getOrganizerProfile() != null ? evaluation.getOrganizerProfile().getId() : null)
                .organizerName(organizerName)
                .innovationScore(evaluation.getInnovationScore())
                .technicalImplementationScore(evaluation.getTechnicalImplementationScore())
                .problemRelevanceScore(evaluation.getProblemRelevanceScore())
                .uiUxScore(evaluation.getUiUxScore())
                .impactScore(evaluation.getImpactScore())
                .totalScore(evaluation.getTotalScore())
                .reviewComment(evaluation.getReviewComment())
                .status(evaluation.getStatus())
                .createdAt(evaluation.getCreatedAt())
                .updatedAt(evaluation.getUpdatedAt())
                .finalizedAt(evaluation.getFinalizedAt())
                .build();
    }
}
