package com.hackhive.admin.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminOrganizerResponse {

    private Long organizerProfileId;

    private Long userId;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String organizationName;

    private String organizationType;

    private String description;

    private String websiteUrl;

    private String contactEmail;

    private String contactPhone;

    private String logoUrl;

    private String location;

    private Boolean verified;

    private boolean enabled;
}