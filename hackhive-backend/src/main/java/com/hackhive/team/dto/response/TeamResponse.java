package com.hackhive.team.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TeamResponse {

    private Long id;

    private String name;

    private String description;

    private Long eventId;

    private String eventTitle;

    private Long leaderId;

    private String leaderName;

    private String collegeName;

    private Integer maxMembers;

    private Long currentMembers;

    private Boolean open;
}