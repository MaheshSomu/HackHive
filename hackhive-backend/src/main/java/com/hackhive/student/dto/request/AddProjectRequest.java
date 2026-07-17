package com.hackhive.student.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AddProjectRequest {

    @NotBlank(message = "Project title is required")
    private String title;

    private String description;

    private String techStack;

    private String githubUrl;

    private String liveUrl;

    private LocalDate startDate;

    private LocalDate endDate;
}