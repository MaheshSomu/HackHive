package com.hackhive.organizer.dto.response;

import com.hackhive.organizer.enums.SocialPlatform;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerSocialLinkResponse {

    private Long id;
    private SocialPlatform platform;
    private String url;
}
