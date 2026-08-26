package com.hackhive.submission.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.submission.dto.request.CreateProjectSubmissionRequest;
import com.hackhive.submission.dto.request.UpdateProjectSubmissionRequest;
import com.hackhive.submission.dto.response.ProjectSubmissionResponse;
import com.hackhive.submission.service.ProjectSubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-submissions")
@RequiredArgsConstructor
@Tag(name = "Project Submission", description = "Endpoints for managing student project submissions")
public class ProjectSubmissionController {

    private final ProjectSubmissionService projectSubmissionService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Create a draft project submission", description = "Allows the team leader to create a draft project submission for an event.")
    public ResponseEntity<ApiResponse<ProjectSubmissionResponse>> createDraft(
            @Valid @RequestBody CreateProjectSubmissionRequest request) {

        ProjectSubmissionResponse response = projectSubmissionService.createDraft(request);

        return ResponseEntity.ok(
                ApiResponse.<ProjectSubmissionResponse>builder()
                        .success(true)
                        .message("Project submission draft created successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/team/{teamId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get team project submission", description = "Retrieves the project submission associated with a specified team ID.")
    public ResponseEntity<ApiResponse<ProjectSubmissionResponse>> getSubmissionByTeam(
            @PathVariable Long teamId) {

        ProjectSubmissionResponse response = projectSubmissionService.getSubmissionByTeam(teamId);

        return ResponseEntity.ok(
                ApiResponse.<ProjectSubmissionResponse>builder()
                        .success(true)
                        .message("Project submission retrieved successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{submissionId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Update draft project submission", description = "Allows the team leader to update an existing draft project submission.")
    public ResponseEntity<ApiResponse<ProjectSubmissionResponse>> updateDraft(
            @PathVariable Long submissionId,
            @Valid @RequestBody UpdateProjectSubmissionRequest request) {

        ProjectSubmissionResponse response = projectSubmissionService.updateDraft(submissionId, request);

        return ResponseEntity.ok(
                ApiResponse.<ProjectSubmissionResponse>builder()
                        .success(true)
                        .message("Project submission draft updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/{submissionId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Finalize and submit project", description = "Finalizes and officially submits the project submission. Submission becomes immutable.")
    public ResponseEntity<ApiResponse<ProjectSubmissionResponse>> submitProject(
            @PathVariable Long submissionId) {

        ProjectSubmissionResponse response = projectSubmissionService.submitProject(submissionId);

        return ResponseEntity.ok(
                ApiResponse.<ProjectSubmissionResponse>builder()
                        .success(true)
                        .message("Project submitted successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Get project submissions for an event", description = "Allows event organizers to view project submissions for their event.")
    public ResponseEntity<ApiResponse<List<ProjectSubmissionResponse>>> getEventSubmissionsForOrganizer(
            @PathVariable Long eventId) {

        List<ProjectSubmissionResponse> response = projectSubmissionService.getEventSubmissionsForOrganizer(eventId);

        return ResponseEntity.ok(
                ApiResponse.<List<ProjectSubmissionResponse>>builder()
                        .success(true)
                        .message("Project submissions fetched successfully.")
                        .data(response)
                        .build()
        );
    }
}
