package com.hackhive.submission.mapper;

import com.hackhive.submission.dto.response.ProjectResultResponse;
import com.hackhive.submission.entity.ProjectResult;
import com.hackhive.submission.entity.ProjectSubmission;
import com.hackhive.submission.entity.ProjectSubmissionEvaluation;
import org.springframework.stereotype.Component;

@Component
public class ProjectResultMapper {

    public ProjectResultResponse toResponse(ProjectResult result, ProjectSubmissionEvaluation evaluation) {
        if (result == null) {
            return null;
        }

        ProjectSubmission submission = result.getProjectSubmission();

        String submittedByName = null;
        if (submission != null && submission.getSubmittedBy() != null && submission.getSubmittedBy().getUser() != null) {
            submittedByName = submission.getSubmittedBy().getUser().getFullName();
        }

        return ProjectResultResponse.builder()
                .id(result.getId())
                .eventId(result.getEvent() != null ? result.getEvent().getId() : null)
                .eventTitle(result.getEvent() != null ? result.getEvent().getTitle() : null)
                .projectSubmissionId(submission != null ? submission.getId() : null)
                .projectTitle(submission != null ? submission.getProjectTitle() : null)
                .teamId(submission != null && submission.getTeam() != null ? submission.getTeam().getId() : null)
                .teamName(submission != null && submission.getTeam() != null ? submission.getTeam().getName() : null)
                .submittedByName(submittedByName)
                .totalScore(evaluation != null ? evaluation.getTotalScore() : 0)
                .maxScore(50)
                .innovationScore(evaluation != null ? evaluation.getInnovationScore() : null)
                .technicalImplementationScore(evaluation != null ? evaluation.getTechnicalImplementationScore() : null)
                .problemRelevanceScore(evaluation != null ? evaluation.getProblemRelevanceScore() : null)
                .uiUxScore(evaluation != null ? evaluation.getUiUxScore() : null)
                .impactScore(evaluation != null ? evaluation.getImpactScore() : null)
                .reviewComment(evaluation != null ? evaluation.getReviewComment() : null)
                .evaluationStatus(evaluation != null ? evaluation.getStatus() : null)
                .rank(result.getRank())
                .awardTitle(result.getAwardTitle())
                .status(result.getStatus())
                .publishedAt(result.getPublishedAt())
                .createdAt(result.getCreatedAt())
                .updatedAt(result.getUpdatedAt())
                .build();
    }
}
