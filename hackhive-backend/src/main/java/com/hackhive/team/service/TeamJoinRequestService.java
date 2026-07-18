package com.hackhive.team.service;

import com.hackhive.team.dto.response.TeamJoinRequestResponse;

import java.util.List;

public interface TeamJoinRequestService {

    // Student operations

    TeamJoinRequestResponse sendJoinRequest(
            Long teamId
    );

    List<TeamJoinRequestResponse> getMyJoinRequests();

    void cancelJoinRequest(
            Long requestId
    );

    // Team leader operations

    List<TeamJoinRequestResponse> getTeamJoinRequests(
            Long teamId
    );

    TeamJoinRequestResponse approveJoinRequest(
            Long requestId
    );

    TeamJoinRequestResponse rejectJoinRequest(
            Long requestId
    );
}