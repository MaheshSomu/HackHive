package com.hackhive.event.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateEventRequest {

    @NotBlank(message = "Event title is required")
    private String title;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Event mode is required")
    private String eventMode;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    private LocalDateTime registrationStartDate;

    @NotNull(message = "Registration end date is required")
    private LocalDateTime registrationEndDate;

    private Integer minTeamSize;

    private Integer maxTeamSize;

    private String eligibility;

    private String bannerUrl;

    private String collegeName;
}