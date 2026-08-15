package com.hackhive.organizer.mapper;

import com.hackhive.organizer.dto.response.OrganizerSocialLinkResponse;
import com.hackhive.organizer.entity.OrganizerSocialLink;
import org.springframework.stereotype.Component;

@Component
public class OrganizerSocialLinkMapper {

    public OrganizerSocialLinkResponse toResponse(OrganizerSocialLink link) {
        if (link == null) {
            return null;
        }

        return OrganizerSocialLinkResponse.builder()
                .id(link.getId())
                .platform(link.getPlatform())
                .url(link.getUrl())
                .build();
    }
}
