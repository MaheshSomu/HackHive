package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.SocialLinkResponse;
import com.hackhive.student.entity.StudentSocialLink;
import org.springframework.stereotype.Component;

@Component
public class StudentSocialLinkMapper {

    public SocialLinkResponse toResponse(
            StudentSocialLink socialLink) {

        return SocialLinkResponse.builder()
                .id(socialLink.getId())
                .platform(socialLink.getPlatform())
                .url(socialLink.getUrl())
                .build();
    }
}