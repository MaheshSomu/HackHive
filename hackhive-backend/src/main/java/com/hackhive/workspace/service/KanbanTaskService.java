package com.hackhive.workspace.service;

import com.hackhive.workspace.dto.request.CreateKanbanTaskRequest;
import com.hackhive.workspace.dto.request.UpdateKanbanTaskRequest;
import com.hackhive.workspace.dto.response.KanbanTaskResponse;

import java.util.List;

public interface KanbanTaskService {

    // Create a new task
    KanbanTaskResponse createTask(
            CreateKanbanTaskRequest request
    );

    // Get a task by ID
    KanbanTaskResponse getTaskById(
            Long taskId
    );

    // Get all tasks for a team
    List<KanbanTaskResponse> getTeamTasks(
            Long teamId
    );

    // Get team tasks filtered by status
    List<KanbanTaskResponse> getTeamTasksByStatus(
            Long teamId,
            String status
    );

    // Get tasks assigned to current student
    List<KanbanTaskResponse> getMyTasks();

    // Update a task
    KanbanTaskResponse updateTask(
            Long taskId,
            UpdateKanbanTaskRequest request
    );

    // Delete a task
    void deleteTask(
            Long taskId
    );
}