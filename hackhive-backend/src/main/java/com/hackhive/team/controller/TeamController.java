package com.hackhive.team.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.team.dto.request.CreateTeamRequest;
import com.hackhive.team.dto.request.UpdateTeamRequest;
import com.hackhive.team.dto.response.TeamMemberResponse;
import com.hackhive.team.dto.response.TeamResponse;
import com.hackhive.team.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<ApiResponse<TeamResponse>> createTeam(
            @Valid @RequestBody CreateTeamRequest request) {

        TeamResponse response =
                teamService.createTeam(request);

        return ResponseEntity.ok(
                ApiResponse.<TeamResponse>builder()
                        .success(true)
                        .message("Team created successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamResponse>> updateTeam(
            @PathVariable Long teamId,
            @Valid @RequestBody UpdateTeamRequest request) {

        TeamResponse response =
                teamService.updateTeam(teamId, request);

        return ResponseEntity.ok(
                ApiResponse.<TeamResponse>builder()
                        .success(true)
                        .message("Team updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(
            @PathVariable Long teamId) {

        teamService.deleteTeam(teamId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Team deleted successfully.")
                        .build()
        );
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamResponse>> getTeamById(
            @PathVariable Long teamId) {

        TeamResponse response =
                teamService.getTeamById(teamId);

        return ResponseEntity.ok(
                ApiResponse.<TeamResponse>builder()
                        .success(true)
                        .message("Team fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamResponse>>> getAllTeams() {

        List<TeamResponse> response =
                teamService.getAllTeams();

        return ResponseEntity.ok(
                ApiResponse.<List<TeamResponse>>builder()
                        .success(true)
                        .message("Teams fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/my-teams")
    public ResponseEntity<ApiResponse<List<TeamResponse>>> getMyTeams() {

        List<TeamResponse> response =
                teamService.getMyTeams();

        return ResponseEntity.ok(
                ApiResponse.<List<TeamResponse>>builder()
                        .success(true)
                        .message("My teams fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/open")
    public ResponseEntity<ApiResponse<List<TeamResponse>>> getOpenTeams() {

        List<TeamResponse> response =
                teamService.getOpenTeams();

        return ResponseEntity.ok(
                ApiResponse.<List<TeamResponse>>builder()
                        .success(true)
                        .message("Open teams fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/search/name")
    public ResponseEntity<ApiResponse<List<TeamResponse>>> searchByName(
            @RequestParam String name) {

        List<TeamResponse> response =
                teamService.searchTeamsByName(name);

        return ResponseEntity.ok(
                ApiResponse.<List<TeamResponse>>builder()
                        .success(true)
                        .message("Teams fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/search/college")
    public ResponseEntity<ApiResponse<List<TeamResponse>>> searchByCollege(
            @RequestParam String collegeName) {

        List<TeamResponse> response =
                teamService.searchTeamsByCollege(collegeName);

        return ResponseEntity.ok(
                ApiResponse.<List<TeamResponse>>builder()
                        .success(true)
                        .message("Teams fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<TeamResponse>>> getTeamsByEvent(
            @PathVariable Long eventId) {

        List<TeamResponse> response =
                teamService.getTeamsByEvent(eventId);

        return ResponseEntity.ok(
                ApiResponse.<List<TeamResponse>>builder()
                        .success(true)
                        .message("Event teams fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<ApiResponse<List<TeamMemberResponse>>> getTeamMembers(
            @PathVariable Long teamId) {

        List<TeamMemberResponse> response =
                teamService.getTeamMembers(teamId);

        return ResponseEntity.ok(
                ApiResponse.<List<TeamMemberResponse>>builder()
                        .success(true)
                        .message("Team members fetched successfully.")
                        .data(response)
                        .build()
        );
    }
}