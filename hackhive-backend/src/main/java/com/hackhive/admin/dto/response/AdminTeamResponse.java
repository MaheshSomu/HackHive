package com.hackhive.admin.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminTeamResponse {

    private Long teamId;

    private String teamName;

    private Long hackathonId;

    private String hackathonName;

    private Long leaderStudentProfileId;

    private String leaderName;

    private Integer currentMembers;

    private Integer maxMembers;
}