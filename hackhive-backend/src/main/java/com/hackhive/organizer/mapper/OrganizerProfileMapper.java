package com.hackhive.organizer.mapper;

import com.hackhive.organizer.dto.response.OrganizerProfileResponse;
import com.hackhive.organizer.entity.OrganizerProfile;
import org.springframework.stereotype.Component;

@Component
public class OrganizerProfileMapper {

    public OrganizerProfileResponse toResponse(
            OrganizerProfile organizerProfile) {

        return OrganizerProfileResponse.builder()
                .id(organizerProfile.getId())
                .organizationName(organizerProfile.getOrganizationName())
                .organizationType(organizerProfile.getOrganizationType())
                .description(organizerProfile.getDescription())
                .websiteUrl(organizerProfile.getWebsiteUrl())
                .contactEmail(organizerProfile.getContactEmail())
                .contactPhone(organizerProfile.getContactPhone())
                .logoUrl(organizerProfile.getLogoUrl())
                .location(organizerProfile.getLocation())
                .verified(organizerProfile.getVerified())
                .build();
    }
}