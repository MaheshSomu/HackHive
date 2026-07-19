package com.hackhive.workspace.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateKanbanTaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private Long assignedToStudentProfileId;

    private String status;

    private String priority;

    private LocalDateTime dueDate;
}