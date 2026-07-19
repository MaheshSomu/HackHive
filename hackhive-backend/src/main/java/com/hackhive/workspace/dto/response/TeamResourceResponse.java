package com.hackhive.workspace.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TeamResourceResponse {

    private Long id;

    private Long teamId;

    private String teamName;

    private Long addedByStudentProfileId;

    private String addedByName;

    private String title;

    private String description;

    private String resourceUrl;

    private String resourceType;

    private LocalDateTime createdAt;
}