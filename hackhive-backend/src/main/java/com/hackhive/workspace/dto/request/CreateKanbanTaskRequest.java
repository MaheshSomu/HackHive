package com.hackhive.workspace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateKanbanTaskRequest {

    @NotNull(message = "Team ID is required")
    private Long teamId;

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    // Optional - task can initially be unassigned
    private Long assignedToStudentProfileId;

    private String status;

    private String priority;

    private LocalDateTime dueDate;
}