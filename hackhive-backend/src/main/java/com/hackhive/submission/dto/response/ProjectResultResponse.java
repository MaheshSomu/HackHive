package com.hackhive.submission.dto.response;

import com.hackhive.submission.enums.ProjectEvaluationStatus;
import com.hackhive.submission.enums.ProjectResultStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResultResponse {

    private Long id;
    private Long eventId;
    private String eventTitle;

    private Long projectSubmissionId;
    private String projectTitle;

    private Long teamId;
    private String teamName;
    private String submittedByName;

    private Integer totalScore;
    @Builder.Default
    private Integer maxScore = 50;

    private Integer innovationScore;
    private Integer technicalImplementationScore;
    private Integer problemRelevanceScore;
    private Integer uiUxScore;
    private Integer impactScore;
    private String reviewComment;

    private ProjectEvaluationStatus evaluationStatus;

    private Integer rank;
    private String awardTitle;
    private ProjectResultStatus status;

    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
