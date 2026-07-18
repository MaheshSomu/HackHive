package com.hackhive.team.mapper;

import com.hackhive.team.dto.response.TeamJoinRequestResponse;
import com.hackhive.team.entity.TeamJoinRequest;
import org.springframework.stereotype.Component;

@Component
public class TeamJoinRequestMapper {

    public TeamJoinRequestResponse toResponse(
            TeamJoinRequest joinRequest) {

        return TeamJoinRequestResponse.builder()
                .requestId(joinRequest.getId())
                .teamId(joinRequest.getTeam().getId())
                .teamName(joinRequest.getTeam().getName())
                .studentProfileId(
                        joinRequest.getStudentProfile().getId())
                .studentName(
                        joinRequest.getStudentProfile()
                                .getUser()
                                .getFullName())
                .studentEmail(
                        joinRequest.getStudentProfile()
                                .getUser()
                                .getEmail())
                .status(joinRequest.getStatus())
                .build();
    }
}