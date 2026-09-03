package com.hackhive.admin.controller;

import com.hackhive.admin.dto.response.AdminDashboardResponse;
import com.hackhive.admin.dto.response.AdminHackathonResponse;
import com.hackhive.admin.dto.response.AdminOrganizerResponse;
import com.hackhive.admin.dto.response.AdminRegistrationResponse;
import com.hackhive.admin.dto.response.AdminTeamResponse;
import com.hackhive.admin.dto.response.AdminUserResponse;
import com.hackhive.admin.service.AdminService;
import com.hackhive.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // =========================================================
    // Dashboard
    // =========================================================

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>>
    getDashboardStatistics() {

        AdminDashboardResponse response =
                adminService.getDashboardStatistics();

        return ResponseEntity.ok(
                ApiResponse.<AdminDashboardResponse>builder()
                        .success(true)
                        .message(
                                "Admin dashboard statistics fetched successfully."
                        )
                        .data(response)
                        .build()
        );
    }

    // =========================================================
    // User Management
    // =========================================================

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>>
    getAllUsers() {

        List<AdminUserResponse> response =
                adminService.getAllUsers();

        return ResponseEntity.ok(
                ApiResponse.<List<AdminUserResponse>>builder()
                        .success(true)
                        .message("Users fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<AdminUserResponse>>
    getUserById(
            @PathVariable Long userId) {

        AdminUserResponse response =
                adminService.getUserById(userId);

        return ResponseEntity.ok(
                ApiResponse.<AdminUserResponse>builder()
                        .success(true)
                        .message("User fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>>
    getUsersByRole(
            @PathVariable String role) {

        List<AdminUserResponse> response =
                adminService.getUsersByRole(role);

        return ResponseEntity.ok(
                ApiResponse.<List<AdminUserResponse>>builder()
                        .success(true)
                        .message(
                                "Users filtered by role successfully."
                        )
                        .data(response)
                        .build()
        );
    }

    @PatchMapping("/users/{userId}/enable")
    public ResponseEntity<ApiResponse<AdminUserResponse>>
    enableUser(
            @PathVariable Long userId) {

        AdminUserResponse response =
                adminService.enableUser(userId);

        return ResponseEntity.ok(
                ApiResponse.<AdminUserResponse>builder()
                        .success(true)
                        .message("User enabled successfully.")
                        .data(response)
                        .build()
        );
    }

    @PatchMapping("/users/{userId}/disable")
    public ResponseEntity<ApiResponse<AdminUserResponse>>
    disableUser(
            @PathVariable Long userId) {

        AdminUserResponse response =
                adminService.disableUser(userId);

        return ResponseEntity.ok(
                ApiResponse.<AdminUserResponse>builder()
                        .success(true)
                        .message("User disabled successfully.")
                        .data(response)
                        .build()
        );
    }

    // =========================================================
    // Organizer Management
    // =========================================================

    @GetMapping("/organizers")
    public ResponseEntity<ApiResponse<List<AdminOrganizerResponse>>>
    getAllOrganizers() {

        List<AdminOrganizerResponse> response =
                adminService.getAllOrganizers();

        return ResponseEntity.ok(
                ApiResponse.<List<AdminOrganizerResponse>>builder()
                        .success(true)
                        .message(
                                "Organizers fetched successfully."
                        )
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/organizers/{organizerProfileId}")
    public ResponseEntity<ApiResponse<AdminOrganizerResponse>>
    getOrganizerById(
            @PathVariable Long organizerProfileId) {

        AdminOrganizerResponse response =
                adminService.getOrganizerById(
                        organizerProfileId
                );

        return ResponseEntity.ok(
                ApiResponse.<AdminOrganizerResponse>builder()
                        .success(true)
                        .message(
                                "Organizer fetched successfully."
                        )
                        .data(response)
                        .build()
        );
    }

    @PatchMapping("/organizers/{organizerProfileId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminOrganizerResponse>>
    verifyOrganizer(
            @PathVariable Long organizerProfileId) {

        AdminOrganizerResponse response =
                adminService.verifyOrganizer(organizerProfileId);

        return ResponseEntity.ok(
                ApiResponse.<AdminOrganizerResponse>builder()
                        .success(true)
                        .message("Organizer verified successfully.")
                        .data(response)
                        .build()
        );
    }

    @PatchMapping("/organizers/{organizerProfileId}/unverify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminOrganizerResponse>>
    unverifyOrganizer(
            @PathVariable Long organizerProfileId) {

        AdminOrganizerResponse response =
                adminService.unverifyOrganizer(organizerProfileId);

        return ResponseEntity.ok(
                ApiResponse.<AdminOrganizerResponse>builder()
                        .success(true)
                        .message("Organizer verification revoked.")
                        .data(response)
                        .build()
        );
    }

    // =========================================================
    // Hackathon Management
    // =========================================================

    @GetMapping("/hackathons")
    public ResponseEntity<ApiResponse<List<AdminHackathonResponse>>>
    getAllHackathons() {

        List<AdminHackathonResponse> response =
                adminService.getAllHackathons();

        return ResponseEntity.ok(
                ApiResponse.<List<AdminHackathonResponse>>builder()
                        .success(true)
                        .message(
                                "Hackathons fetched successfully."
                        )
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/hackathons/{hackathonId}")
    public ResponseEntity<ApiResponse<AdminHackathonResponse>>
    getHackathonById(
            @PathVariable Long hackathonId) {

        AdminHackathonResponse response =
                adminService.getHackathonById(
                        hackathonId
                );

        return ResponseEntity.ok(
                ApiResponse.<AdminHackathonResponse>builder()
                        .success(true)
                        .message(
                                "Hackathon fetched successfully."
                        )
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/hackathons/{hackathonId}")
    public ResponseEntity<ApiResponse<Void>>
    deleteHackathon(
            @PathVariable Long hackathonId) {

        adminService.deleteHackathon(hackathonId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message(
                                "Hackathon deleted successfully."
                        )
                        .build()
        );
    }

    // =========================================================
    // Team Oversight
    // =========================================================

    @GetMapping("/teams")
    public ResponseEntity<ApiResponse<List<AdminTeamResponse>>>
    getAllTeams() {

        List<AdminTeamResponse> response =
                adminService.getAllTeams();

        return ResponseEntity.ok(
                ApiResponse.<List<AdminTeamResponse>>builder()
                        .success(true)
                        .message("Teams fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<ApiResponse<AdminTeamResponse>>
    getTeamById(
            @PathVariable Long teamId) {

        AdminTeamResponse response =
                adminService.getTeamById(teamId);

        return ResponseEntity.ok(
                ApiResponse.<AdminTeamResponse>builder()
                        .success(true)
                        .message("Team fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    // =========================================================
    // Registration Oversight
    // =========================================================

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<AdminRegistrationResponse>>>
    getAllRegistrations() {

        List<AdminRegistrationResponse> response =
                adminService.getAllRegistrations();

        return ResponseEntity.ok(
                ApiResponse.<List<AdminRegistrationResponse>>builder()
                        .success(true)
                        .message(
                                "Registrations fetched successfully."
                        )
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/registrations/{registrationId}")
    public ResponseEntity<ApiResponse<AdminRegistrationResponse>>
    getRegistrationById(
            @PathVariable Long registrationId) {

        AdminRegistrationResponse response =
                adminService.getRegistrationById(
                        registrationId
                );

        return ResponseEntity.ok(
                ApiResponse.<AdminRegistrationResponse>builder()
                        .success(true)
                        .message(
                                "Registration fetched successfully."
                        )
                        .data(response)
                        .build()
        );
    }
}