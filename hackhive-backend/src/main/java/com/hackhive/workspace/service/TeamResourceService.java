package com.hackhive.workspace.service;

import com.hackhive.workspace.dto.request.CreateTeamResourceRequest;
import com.hackhive.workspace.dto.request.UpdateTeamResourceRequest;
import com.hackhive.workspace.dto.response.TeamResourceResponse;

import java.util.List;

public interface TeamResourceService {

    // Add a resource to a team's workspace
    TeamResourceResponse createResource(
            CreateTeamResourceRequest request
    );

    // Get a single resource
    TeamResourceResponse getResourceById(
            Long resourceId
    );

    // Get all resources belonging to a team
    List<TeamResourceResponse> getTeamResources(
            Long teamId
    );

    // Filter team resources by type
    List<TeamResourceResponse> getTeamResourcesByType(
            Long teamId,
            String resourceType
    );

    // Update an existing resource
    TeamResourceResponse updateResource(
            Long resourceId,
            UpdateTeamResourceRequest request
    );

    // Delete a resource
    void deleteResource(
            Long resourceId
    );
}