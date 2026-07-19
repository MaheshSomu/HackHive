package com.hackhive.workspace.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.workspace.dto.request.CreateTeamResourceRequest;
import com.hackhive.workspace.dto.request.UpdateTeamResourceRequest;
import com.hackhive.workspace.dto.response.TeamResourceResponse;
import com.hackhive.workspace.service.TeamResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-resources")
@RequiredArgsConstructor
public class TeamResourceController {

    private final TeamResourceService teamResourceService;

    /**
     * Add a new resource to a team's workspace.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TeamResourceResponse>> createResource(
            @Valid @RequestBody CreateTeamResourceRequest request) {

        TeamResourceResponse response =
                teamResourceService.createResource(request);

        return ResponseEntity.ok(
                ApiResponse.<TeamResourceResponse>builder()
                        .success(true)
                        .message("Team resource created successfully.")
                        .data(response)
                        .build()
        );
    }

    /**
     * Get a single resource by ID.
     */
    @GetMapping("/{resourceId}")
    public ResponseEntity<ApiResponse<TeamResourceResponse>> getResourceById(
            @PathVariable Long resourceId) {

        TeamResourceResponse response =
                teamResourceService.getResourceById(resourceId);

        return ResponseEntity.ok(
                ApiResponse.<TeamResourceResponse>builder()
                        .success(true)
                        .message("Team resource fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    /**
     * Get all resources belonging to a team.
     */
    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<TeamResourceResponse>>>
    getTeamResources(
            @PathVariable Long teamId) {

        List<TeamResourceResponse> response =
                teamResourceService.getTeamResources(teamId);

        return ResponseEntity.ok(
                ApiResponse.<List<TeamResourceResponse>>builder()
                        .success(true)
                        .message("Team resources fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    /**
     * Get team resources filtered by resource type.
     */
    @GetMapping("/team/{teamId}/type")
    public ResponseEntity<ApiResponse<List<TeamResourceResponse>>>
    getTeamResourcesByType(
            @PathVariable Long teamId,
            @RequestParam String resourceType) {

        List<TeamResourceResponse> response =
                teamResourceService.getTeamResourcesByType(
                        teamId,
                        resourceType
                );

        return ResponseEntity.ok(
                ApiResponse.<List<TeamResourceResponse>>builder()
                        .success(true)
                        .message("Team resources fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    /**
     * Update an existing team resource.
     */
    @PutMapping("/{resourceId}")
    public ResponseEntity<ApiResponse<TeamResourceResponse>> updateResource(
            @PathVariable Long resourceId,
            @Valid @RequestBody UpdateTeamResourceRequest request) {

        TeamResourceResponse response =
                teamResourceService.updateResource(
                        resourceId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<TeamResourceResponse>builder()
                        .success(true)
                        .message("Team resource updated successfully.")
                        .data(response)
                        .build()
        );
    }

    /**
     * Delete a team resource.
     */
    @DeleteMapping("/{resourceId}")
    public ResponseEntity<ApiResponse<Void>> deleteResource(
            @PathVariable Long resourceId) {

        teamResourceService.deleteResource(resourceId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Team resource deleted successfully.")
                        .build()
        );
    }
}