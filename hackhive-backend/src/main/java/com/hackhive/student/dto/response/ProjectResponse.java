package com.hackhive.student.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ProjectResponse {

    private Long id;

    private String title;

    private String description;

    private String techStack;

    private String githubUrl;

    private String liveUrl;

    private LocalDate startDate;

    private LocalDate endDate;
}