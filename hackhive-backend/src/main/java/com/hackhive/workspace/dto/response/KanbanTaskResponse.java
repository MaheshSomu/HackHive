package com.hackhive.workspace.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class KanbanTaskResponse {

    private Long id;

    private Long teamId;

    private String teamName;

    private String title;

    private String description;

    private Long assignedToStudentProfileId;

    private String assignedToName;

    private String status;

    private String priority;

    private LocalDateTime dueDate;
}