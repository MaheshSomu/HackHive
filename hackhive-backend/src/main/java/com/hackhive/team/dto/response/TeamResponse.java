package com.hackhive.team.dto.response;

import com.hackhive.team.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {

    private Long id;

    private String name;

    private String description;

    private Long eventId;

    private String eventTitle;

    private EventType eventType;

    private ExternalEventResponse externalEvent;

    private Long leaderId;

    private String leaderName;

    private String collegeName;

    private Integer maxMembers;

    private Long currentMembers;

    private Boolean open;
}