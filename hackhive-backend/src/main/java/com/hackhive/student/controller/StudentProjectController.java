package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.AddProjectRequest;
import com.hackhive.student.dto.request.UpdateProjectRequest;
import com.hackhive.student.dto.response.ProjectResponse;
import com.hackhive.student.service.StudentProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/projects")
@RequiredArgsConstructor
public class StudentProjectController {

    private final StudentProjectService studentProjectService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> addProject(
            @Valid @RequestBody AddProjectRequest request) {

        ProjectResponse response =
                studentProjectService.addProject(request);

        return ResponseEntity.ok(
                ApiResponse.<ProjectResponse>builder()
                        .success(true)
                        .message("Project added successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getMyProjects() {

        List<ProjectResponse> response =
                studentProjectService.getMyProjects();

        return ResponseEntity.ok(
                ApiResponse.<List<ProjectResponse>>builder()
                        .success(true)
                        .message("Projects fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request) {

        ProjectResponse response =
                studentProjectService.updateProject(id, request);

        return ResponseEntity.ok(
                ApiResponse.<ProjectResponse>builder()
                        .success(true)
                        .message("Project updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long id) {

        studentProjectService.deleteProject(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Project deleted successfully.")
                        .build()
        );
    }
}