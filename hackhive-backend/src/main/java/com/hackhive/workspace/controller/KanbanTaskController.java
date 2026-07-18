package com.hackhive.workspace.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.workspace.dto.request.CreateKanbanTaskRequest;
import com.hackhive.workspace.dto.request.UpdateKanbanTaskRequest;
import com.hackhive.workspace.dto.response.KanbanTaskResponse;
import com.hackhive.workspace.service.KanbanTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kanban-tasks")
@RequiredArgsConstructor
public class KanbanTaskController {

    private final KanbanTaskService kanbanTaskService;

    // Create a new task
    @PostMapping
    public ResponseEntity<ApiResponse<KanbanTaskResponse>> createTask(
            @Valid @RequestBody CreateKanbanTaskRequest request) {

        KanbanTaskResponse response =
                kanbanTaskService.createTask(request);

        return ResponseEntity.ok(
                ApiResponse.<KanbanTaskResponse>builder()
                        .success(true)
                        .message("Kanban task created successfully.")
                        .data(response)
                        .build()
        );
    }

    // Get a single task
    @GetMapping("/{taskId}")
    public ResponseEntity<ApiResponse<KanbanTaskResponse>> getTaskById(
            @PathVariable Long taskId) {

        KanbanTaskResponse response =
                kanbanTaskService.getTaskById(taskId);

        return ResponseEntity.ok(
                ApiResponse.<KanbanTaskResponse>builder()
                        .success(true)
                        .message("Kanban task fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    // Get all tasks belonging to a team
    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<KanbanTaskResponse>>> getTeamTasks(
            @PathVariable Long teamId) {

        List<KanbanTaskResponse> response =
                kanbanTaskService.getTeamTasks(teamId);

        return ResponseEntity.ok(
                ApiResponse.<List<KanbanTaskResponse>>builder()
                        .success(true)
                        .message("Team Kanban tasks fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    // Get team tasks filtered by status
    @GetMapping("/team/{teamId}/status")
    public ResponseEntity<ApiResponse<List<KanbanTaskResponse>>>
    getTeamTasksByStatus(
            @PathVariable Long teamId,
            @RequestParam String status) {

        List<KanbanTaskResponse> response =
                kanbanTaskService.getTeamTasksByStatus(
                        teamId,
                        status
                );

        return ResponseEntity.ok(
                ApiResponse.<List<KanbanTaskResponse>>builder()
                        .success(true)
                        .message("Kanban tasks fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    // Get tasks assigned to currently logged-in student
    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<KanbanTaskResponse>>> getMyTasks() {

        List<KanbanTaskResponse> response =
                kanbanTaskService.getMyTasks();

        return ResponseEntity.ok(
                ApiResponse.<List<KanbanTaskResponse>>builder()
                        .success(true)
                        .message("My Kanban tasks fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    // Update a task
    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<KanbanTaskResponse>> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateKanbanTaskRequest request) {

        KanbanTaskResponse response =
                kanbanTaskService.updateTask(
                        taskId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<KanbanTaskResponse>builder()
                        .success(true)
                        .message("Kanban task updated successfully.")
                        .data(response)
                        .build()
        );
    }

    // Delete a task
    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long taskId) {

        kanbanTaskService.deleteTask(taskId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Kanban task deleted successfully.")
                        .build()
        );
    }
}