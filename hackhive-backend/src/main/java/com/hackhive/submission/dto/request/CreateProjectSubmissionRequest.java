package com.hackhive.submission.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProjectSubmissionRequest {

    @NotNull(message = "Event ID is required.")
    private Long eventId;

    @NotNull(message = "Team ID is required.")
    private Long teamId;

    @NotBlank(message = "Project title is required.")
    @Size(max = 200, message = "Project title cannot exceed 200 characters.")
    private String projectTitle;

    @NotBlank(message = "Problem statement is required.")
    private String problemStatement;

    @NotBlank(message = "Project description is required.")
    private String projectDescription;

    @Size(max = 500, message = "Technologies used text cannot exceed 500 characters.")
    private String technologiesUsed;

    @Size(max = 255, message = "GitHub URL cannot exceed 255 characters.")
    private String githubUrl;

    @Size(max = 255, message = "Demo URL cannot exceed 255 characters.")
    private String demoUrl;

    @Size(max = 255, message = "Presentation URL cannot exceed 255 characters.")
    private String presentationUrl;
}
