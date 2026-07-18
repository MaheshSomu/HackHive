package com.hackhive.organizer.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrganizerProfileResponse {

    private Long id;

    private String organizationName;

    private String organizationType;

    private String description;

    private String websiteUrl;

    private String contactEmail;

    private String contactPhone;

    private String logoUrl;

    private String location;

    private Boolean verified;
}