package com.hackhive.team.dto.request;

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

    @NotNull(message = "Event ID is required")
    private Long eventId;

    private String collegeName;

    @NotNull(message = "Maximum members is required")
    @Positive(message = "Maximum members must be greater than zero")
    private Integer maxMembers;
}