package com.hackhive.team.service;

public interface TeamMemberService {

    // Current logged-in student leaves a team
    void leaveTeam(Long teamId);

    // Team leader removes a member
    void removeMember(
            Long teamId,
            Long studentProfileId
    );
}