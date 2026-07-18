package com.hackhive.event.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class EventResponse {

    private Long id;

    private Long organizerId;

    private String organizerName;

    private String title;

    private String description;

    private String location;

    private String eventMode;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private LocalDateTime registrationStartDate;

    private LocalDateTime registrationEndDate;

    private Integer minTeamSize;

    private Integer maxTeamSize;

    private String eligibility;

    private String bannerUrl;

    private String collegeName;
}