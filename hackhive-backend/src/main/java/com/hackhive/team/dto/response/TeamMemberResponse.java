package com.hackhive.team.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TeamMemberResponse {

    private Long memberId;

    private Long studentProfileId;

    private String fullName;

    private String email;

    private String college;

    private String branch;

    private String role;
}