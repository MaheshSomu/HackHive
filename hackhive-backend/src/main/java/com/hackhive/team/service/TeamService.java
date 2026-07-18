package com.hackhive.team.service;

import com.hackhive.team.dto.request.CreateTeamRequest;
import com.hackhive.team.dto.request.UpdateTeamRequest;
import com.hackhive.team.dto.response.TeamMemberResponse;
import com.hackhive.team.dto.response.TeamResponse;

import java.util.List;

public interface TeamService {

    // Team management

    TeamResponse createTeam(
            CreateTeamRequest request
    );

    TeamResponse updateTeam(
            Long teamId,
            UpdateTeamRequest request
    );

    void deleteTeam(
            Long teamId
    );

    TeamResponse getTeamById(
            Long teamId
    );

    // Team discovery

    List<TeamResponse> getAllTeams();

    List<TeamResponse> searchTeamsByName(
            String name
    );

    List<TeamResponse> searchTeamsByCollege(
            String collegeName
    );

    List<TeamResponse> getTeamsByEvent(
            Long eventId
    );

    List<TeamResponse> getOpenTeams();

    // Current student's teams

    List<TeamResponse> getMyTeams();

    // Team members

    List<TeamMemberResponse> getTeamMembers(
            Long teamId
    );
}