package com.hackhive.student.service;

import com.hackhive.student.dto.request.AddSocialLinkRequest;
import com.hackhive.student.dto.request.UpdateSocialLinkRequest;
import com.hackhive.student.dto.response.SocialLinkResponse;

import java.util.List;

public interface StudentSocialLinkService {

    SocialLinkResponse addSocialLink(
            AddSocialLinkRequest request
    );

    List<SocialLinkResponse> getMySocialLinks();

    SocialLinkResponse updateSocialLink(
            Long id,
            UpdateSocialLinkRequest request
    );

    void deleteSocialLink(Long id);
}