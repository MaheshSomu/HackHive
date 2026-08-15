package com.hackhive.organizer.service;

import com.hackhive.organizer.dto.request.OrganizerSocialLinkRequest;
import com.hackhive.organizer.dto.response.OrganizerSocialLinkResponse;
import com.hackhive.organizer.enums.SocialPlatform;

import java.util.List;

public interface OrganizerSocialLinkService {

    List<OrganizerSocialLinkResponse> getMySocialLinks();

    OrganizerSocialLinkResponse saveSocialLink(OrganizerSocialLinkRequest request);

    void deleteSocialLink(Long id);

    void deleteSocialLinkByPlatform(SocialPlatform platform);
}
