package com.hackhive.workspace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTeamResourceRequest {

    @NotNull(message = "Team ID is required")
    private Long teamId;

    @NotBlank(message = "Resource title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Size(max = 1000, message = "Resource URL cannot exceed 1000 characters")
    private String resourceUrl;

    @NotBlank(message = "Resource type is required")
    private String resourceType;
}