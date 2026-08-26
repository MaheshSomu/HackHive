package com.hackhive.submission.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfigureProjectResultRequest {

    @NotNull(message = "Project submission ID is required.")
    private Long projectSubmissionId;

    @Min(value = 1, message = "Rank must be a positive number.")
    private Integer rank;

    @Size(max = 150, message = "Award title cannot exceed 150 characters.")
    private String awardTitle;
}
