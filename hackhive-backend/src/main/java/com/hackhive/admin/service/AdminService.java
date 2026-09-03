package com.hackhive.admin.service;

import com.hackhive.admin.dto.response.AdminDashboardResponse;
import com.hackhive.admin.dto.response.AdminHackathonResponse;
import com.hackhive.admin.dto.response.AdminOrganizerResponse;
import com.hackhive.admin.dto.response.AdminRegistrationResponse;
import com.hackhive.admin.dto.response.AdminTeamResponse;
import com.hackhive.admin.dto.response.AdminUserResponse;

import java.util.List;

public interface AdminService {

    // Dashboard
    AdminDashboardResponse getDashboardStatistics();

    // User Management
    List<AdminUserResponse> getAllUsers();

    AdminUserResponse getUserById(
            Long userId
    );

    List<AdminUserResponse> getUsersByRole(
            String role
    );

    AdminUserResponse enableUser(
            Long userId
    );

    AdminUserResponse disableUser(
            Long userId
    );

    // Organizer Management
    List<AdminOrganizerResponse> getAllOrganizers();

    AdminOrganizerResponse getOrganizerById(
            Long organizerProfileId
    );

    AdminOrganizerResponse verifyOrganizer(
            Long organizerProfileId
    );

    AdminOrganizerResponse unverifyOrganizer(
            Long organizerProfileId
    );

    // Hackathon Management
    List<AdminHackathonResponse> getAllHackathons();

    AdminHackathonResponse getHackathonById(
            Long hackathonId
    );

    void deleteHackathon(
            Long hackathonId
    );

    // Team Oversight
    List<AdminTeamResponse> getAllTeams();

    AdminTeamResponse getTeamById(
            Long teamId
    );

    // Registration Oversight
    List<AdminRegistrationResponse> getAllRegistrations();

    AdminRegistrationResponse getRegistrationById(
            Long registrationId
    );
}