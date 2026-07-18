package com.hackhive.workspace.mapper;

import com.hackhive.workspace.dto.response.KanbanTaskResponse;
import com.hackhive.workspace.entity.KanbanTask;
import org.springframework.stereotype.Component;

@Component
public class KanbanTaskMapper {

    public KanbanTaskResponse toResponse(
            KanbanTask task) {

        return KanbanTaskResponse.builder()
                .id(task.getId())
                .teamId(task.getTeam().getId())
                .teamName(task.getTeam().getName())
                .title(task.getTitle())
                .description(task.getDescription())
                .assignedToStudentProfileId(
                        task.getAssignedTo() != null
                                ? task.getAssignedTo().getId()
                                : null
                )
                .assignedToName(
                        task.getAssignedTo() != null
                                ? task.getAssignedTo()
                                    .getUser()
                                    .getFullName()
                                : null
                )
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .build();
    }
}