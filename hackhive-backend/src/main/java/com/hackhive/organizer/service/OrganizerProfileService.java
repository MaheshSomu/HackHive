package com.hackhive.organizer.service;

import com.hackhive.organizer.dto.request.CreateOrganizerProfileRequest;
import com.hackhive.organizer.dto.request.UpdateOrganizerProfileRequest;
import com.hackhive.organizer.dto.response.OrganizerProfileResponse;

public interface OrganizerProfileService {

    OrganizerProfileResponse createProfile(
            CreateOrganizerProfileRequest request
    );

    OrganizerProfileResponse getMyProfile();

    OrganizerProfileResponse updateProfile(
            UpdateOrganizerProfileRequest request
    );
}