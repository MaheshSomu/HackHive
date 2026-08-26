package com.hackhive.submission.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.submission.dto.request.ConfigureProjectResultRequest;
import com.hackhive.submission.dto.request.UpdateProjectResultRequest;
import com.hackhive.submission.dto.response.ProjectResultResponse;
import com.hackhive.submission.service.ProjectResultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-results")
@RequiredArgsConstructor
@Tag(name = "Project Results & Leaderboard", description = "Endpoints for event organizers and students to manage and view project results & leaderboards")
public class ProjectResultController {

    private final ProjectResultService resultService;

    @PostMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Configure project result", description = "Allows event organizers to set rank and award title for a project submission.")
    public ResponseEntity<ApiResponse<ProjectResultResponse>> configureResult(
            @PathVariable Long eventId,
            @Valid @RequestBody ConfigureProjectResultRequest request) {

        ProjectResultResponse response = resultService.configureResult(eventId, request);

        return ResponseEntity.ok(
                ApiResponse.<ProjectResultResponse>builder()
                        .success(true)
                        .message("Project result configured successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Get event leaderboard for organizer", description = "Retrieves the full event leaderboard and results management table for event organizers.")
    public ResponseEntity<ApiResponse<List<ProjectResultResponse>>> getEventLeaderboardForOrganizer(
            @PathVariable Long eventId) {

        List<ProjectResultResponse> response = resultService.getEventLeaderboardForOrganizer(eventId);

        return ResponseEntity.ok(
                ApiResponse.<List<ProjectResultResponse>>builder()
                        .success(true)
                        .message("Event leaderboard retrieved successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{resultId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Update project result", description = "Allows event organizers to update rank or award title for a project result.")
    public ResponseEntity<ApiResponse<ProjectResultResponse>> updateResult(
            @PathVariable Long resultId,
            @Valid @RequestBody UpdateProjectResultRequest request) {

        ProjectResultResponse response = resultService.updateResult(resultId, request);

        return ResponseEntity.ok(
                ApiResponse.<ProjectResultResponse>builder()
                        .success(true)
                        .message("Project result updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/{resultId}/publish")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Publish single project result", description = "Publishes an individual project result making it visible to students.")
    public ResponseEntity<ApiResponse<ProjectResultResponse>> publishResult(
            @PathVariable Long resultId) {

        ProjectResultResponse response = resultService.publishResult(resultId);

        return ResponseEntity.ok(
                ApiResponse.<ProjectResultResponse>builder()
                        .success(true)
                        .message("Project result published successfully.")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/events/{eventId}/publish-all")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Publish all event results", description = "Publishes all configured results for an event making the leaderboard public to students.")
    public ResponseEntity<ApiResponse<List<ProjectResultResponse>>> publishAllResultsForEvent(
            @PathVariable Long eventId) {

        List<ProjectResultResponse> response = resultService.publishAllResultsForEvent(eventId);

        return ResponseEntity.ok(
                ApiResponse.<List<ProjectResultResponse>>builder()
                        .success(true)
                        .message("All event results published successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/events/{eventId}/published")
    @PreAuthorize("hasAnyRole('STUDENT', 'ORGANIZER', 'ADMIN')")
    @Operation(summary = "Get published event results", description = "Retrieves published results and official leaderboard for an event.")
    public ResponseEntity<ApiResponse<List<ProjectResultResponse>>> getPublishedResultsForEvent(
            @PathVariable Long eventId) {

        List<ProjectResultResponse> response = resultService.getPublishedResultsForEvent(eventId);

        return ResponseEntity.ok(
                ApiResponse.<List<ProjectResultResponse>>builder()
                        .success(true)
                        .message("Published event results retrieved successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/team/{teamId}/published")
    @PreAuthorize("hasAnyRole('STUDENT', 'ORGANIZER', 'ADMIN')")
    @Operation(summary = "Get team published result", description = "Retrieves the official published result for a specific student team.")
    public ResponseEntity<ApiResponse<ProjectResultResponse>> getPublishedResultForTeam(
            @PathVariable Long teamId) {

        ProjectResultResponse response = resultService.getPublishedResultForTeam(teamId);

        return ResponseEntity.ok(
                ApiResponse.<ProjectResultResponse>builder()
                        .success(true)
                        .message("Team published result retrieved successfully.")
                        .data(response)
                        .build()
        );
    }
}
