package com.hackhive.submission.dto.response;

import com.hackhive.submission.enums.ProjectEvaluationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSubmissionEvaluationResponse {

    private Long id;
    private Long projectSubmissionId;
    private String projectTitle;
    private Long teamId;
    private String teamName;
    private Long organizerProfileId;
    private String organizerName;

    private Integer innovationScore;
    private Integer technicalImplementationScore;
    private Integer problemRelevanceScore;
    private Integer uiUxScore;
    private Integer impactScore;
    private Integer totalScore;

    private String reviewComment;
    private ProjectEvaluationStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime finalizedAt;
}
