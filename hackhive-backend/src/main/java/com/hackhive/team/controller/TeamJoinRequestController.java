package com.hackhive.team.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.team.dto.response.TeamJoinRequestResponse;
import com.hackhive.team.service.TeamJoinRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-join-requests")
@RequiredArgsConstructor
public class TeamJoinRequestController {

    private final TeamJoinRequestService teamJoinRequestService;

    @PostMapping("/teams/{teamId}")
    public ResponseEntity<ApiResponse<TeamJoinRequestResponse>>
    sendJoinRequest(@PathVariable Long teamId) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.sendJoinRequest(teamId);

        return ResponseEntity.ok(
                ApiResponse.<TeamJoinRequestResponse>builder()
                        .success(true)
                        .message("Join request sent successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<TeamJoinRequestResponse>>>
    getMyJoinRequests() {

        List<TeamJoinRequestResponse> response =
                teamJoinRequestService.getMyJoinRequests();

        return ResponseEntity.ok(
                ApiResponse.<List<TeamJoinRequestResponse>>builder()
                        .success(true)
                        .message("Join requests fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<ApiResponse<Void>> cancelJoinRequest(
            @PathVariable Long requestId) {

        teamJoinRequestService.cancelJoinRequest(requestId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Join request cancelled successfully.")
                        .build()
        );
    }

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<ApiResponse<List<TeamJoinRequestResponse>>>
    getTeamJoinRequests(@PathVariable Long teamId) {

        List<TeamJoinRequestResponse> response =
                teamJoinRequestService.getTeamJoinRequests(teamId);

        return ResponseEntity.ok(
                ApiResponse.<List<TeamJoinRequestResponse>>builder()
                        .success(true)
                        .message("Team join requests fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{requestId}/approve")
    public ResponseEntity<ApiResponse<TeamJoinRequestResponse>>
    approveJoinRequest(@PathVariable Long requestId) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.approveJoinRequest(requestId);

        return ResponseEntity.ok(
                ApiResponse.<TeamJoinRequestResponse>builder()
                        .success(true)
                        .message("Join request approved successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{requestId}/reject")
    public ResponseEntity<ApiResponse<TeamJoinRequestResponse>>
    rejectJoinRequest(@PathVariable Long requestId) {

        TeamJoinRequestResponse response =
                teamJoinRequestService.rejectJoinRequest(requestId);

        return ResponseEntity.ok(
                ApiResponse.<TeamJoinRequestResponse>builder()
                        .success(true)
                        .message("Join request rejected successfully.")
                        .data(response)
                        .build()
        );
    }
}