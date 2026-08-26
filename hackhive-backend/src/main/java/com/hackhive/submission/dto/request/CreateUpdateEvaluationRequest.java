package com.hackhive.submission.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUpdateEvaluationRequest {

    @Min(value = 0, message = "Innovation score must be at least 0.")
    @Max(value = 10, message = "Innovation score cannot exceed 10.")
    private Integer innovationScore;

    @Min(value = 0, message = "Technical implementation score must be at least 0.")
    @Max(value = 10, message = "Technical implementation score cannot exceed 10.")
    private Integer technicalImplementationScore;

    @Min(value = 0, message = "Problem relevance score must be at least 0.")
    @Max(value = 10, message = "Problem relevance score cannot exceed 10.")
    private Integer problemRelevanceScore;

    @Min(value = 0, message = "UI/UX score must be at least 0.")
    @Max(value = 10, message = "UI/UX score cannot exceed 10.")
    private Integer uiUxScore;

    @Min(value = 0, message = "Impact score must be at least 0.")
    @Max(value = 10, message = "Impact score cannot exceed 10.")
    private Integer impactScore;

    private String reviewComment;
}
