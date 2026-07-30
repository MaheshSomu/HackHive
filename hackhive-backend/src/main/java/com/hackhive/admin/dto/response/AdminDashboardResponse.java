package com.hackhive.admin.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminDashboardResponse {

    private long totalUsers;

    private long totalStudents;

    private long totalOrganizers;

    private long totalHackathons;

    private long totalTeams;

    private long totalRegistrations;
}