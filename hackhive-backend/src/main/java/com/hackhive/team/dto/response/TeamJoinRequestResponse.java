package com.hackhive.team.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TeamJoinRequestResponse {

    private Long requestId;

    private Long teamId;

    private String teamName;

    private Long studentProfileId;

    private String studentName;

    private String studentEmail;

    private String status;
}