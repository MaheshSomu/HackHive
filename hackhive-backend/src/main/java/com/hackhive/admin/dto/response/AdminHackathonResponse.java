package com.hackhive.admin.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminHackathonResponse {

    private Long hackathonId;

    private String title;

    private String description;

    private Long organizerProfileId;

    private String organizerName;

    private String organizationName;

    private String location;

    private String mode;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private LocalDateTime registrationStartDate;

    private LocalDateTime registrationDeadline;

    private Integer minTeamSize;

    private Integer maxTeamSize;

    private String eligibility;

    private String bannerUrl;

    private String collegeName;
}