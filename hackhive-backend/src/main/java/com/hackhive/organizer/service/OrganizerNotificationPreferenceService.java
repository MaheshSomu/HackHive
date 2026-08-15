package com.hackhive.organizer.service;

import com.hackhive.organizer.dto.request.UpdateOrganizerNotificationPreferenceRequest;
import com.hackhive.organizer.dto.response.OrganizerNotificationPreferenceResponse;
import com.hackhive.organizer.entity.OrganizerNotificationPreference;
import com.hackhive.organizer.entity.OrganizerProfile;

public interface OrganizerNotificationPreferenceService {

    OrganizerNotificationPreferenceResponse getPreferences();

    OrganizerNotificationPreferenceResponse updatePreferences(UpdateOrganizerNotificationPreferenceRequest request);

    OrganizerNotificationPreference createDefaultPreferences(OrganizerProfile organizerProfile);
}
