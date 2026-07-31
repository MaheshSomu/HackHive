package com.hackhive.team.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.team.service.TeamMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    /**
     * Current logged-in student leaves a team.
     */
    @DeleteMapping("/{teamId}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveTeam(
            @PathVariable Long teamId) {

        teamMemberService.leaveTeam(teamId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("You have left the team successfully.")
                        .build()
        );
    }

    /**
     * Team leader removes a member.
     */
    @DeleteMapping(
            "/{teamId}/members/{studentProfileId}"
    )
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long teamId,
            @PathVariable Long studentProfileId) {

        teamMemberService.removeMember(
                teamId,
                studentProfileId
        );

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message(
                                "Team member removed successfully."
                        )
                        .build()
        );
    }
}