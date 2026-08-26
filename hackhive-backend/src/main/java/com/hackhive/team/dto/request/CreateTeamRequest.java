package com.hackhive.team.dto.request;

import com.hackhive.team.enums.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTeamRequest {

    @NotBlank(message = "Team name is required")
    private String name;

    private String description;

    // HackHive Event ID (nullable for External Events)
    private Long eventId;

    // Event Type (HACKHIVE or EXTERNAL, optional - defaults based on provided fields)
    private EventType eventType;

    // External Event Details (nullable for HackHive Events)
    private String externalEventName;
    private String externalOrganizerName;
    private String externalEventDate;
    private String externalDescription;

    private String collegeName;

    @NotNull(message = "Maximum members is required")
    @Positive(message = "Maximum members must be greater than zero")
    private Integer maxMembers;
}