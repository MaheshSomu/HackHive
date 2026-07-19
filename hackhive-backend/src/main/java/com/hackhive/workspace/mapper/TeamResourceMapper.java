package com.hackhive.workspace.mapper;

import com.hackhive.workspace.dto.response.TeamResourceResponse;
import com.hackhive.workspace.entity.TeamResource;
import org.springframework.stereotype.Component;

@Component
public class TeamResourceMapper {

    public TeamResourceResponse toResponse(
            TeamResource teamResource) {

        return TeamResourceResponse.builder()
                .id(teamResource.getId())
                .teamId(teamResource.getTeam().getId())
                .teamName(teamResource.getTeam().getName())
                .addedByStudentProfileId(
                        teamResource.getAddedBy().getId()
                )
                .addedByName(
                        teamResource.getAddedBy()
                                .getUser()
                                .getFullName()
                )
                .title(teamResource.getTitle())
                .description(teamResource.getDescription())
                .resourceUrl(teamResource.getResourceUrl())
                .resourceType(teamResource.getResourceType())
                .createdAt(teamResource.getCreatedAt())
                .build();
    }
}