package com.hackhive.workspace.repository;

import com.hackhive.team.entity.Team;
import com.hackhive.workspace.entity.TeamResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamResourceRepository
        extends JpaRepository<TeamResource, Long> {

    // Get all resources belonging to a team
    List<TeamResource> findByTeam(
            Team team
    );

    // Get team resources filtered by type
    List<TeamResource> findByTeamAndResourceType(
            Team team,
            String resourceType
    );
}