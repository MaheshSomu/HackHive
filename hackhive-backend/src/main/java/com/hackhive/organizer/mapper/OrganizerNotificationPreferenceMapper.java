package com.hackhive.organizer.mapper;

import com.hackhive.organizer.dto.response.OrganizerNotificationPreferenceResponse;
import com.hackhive.organizer.entity.OrganizerNotificationPreference;
import org.springframework.stereotype.Component;

@Component
public class OrganizerNotificationPreferenceMapper {

    public OrganizerNotificationPreferenceResponse toResponse(OrganizerNotificationPreference preference) {
        if (preference == null) {
            return null;
        }

        return OrganizerNotificationPreferenceResponse.builder()
                .id(preference.getId())
                .registrations(preference.getRegistrations())
                .teamRequests(preference.getTeamRequests())
                .eventUpdates(preference.getEventUpdates())
                .weeklySummary(preference.getWeeklySummary())
                .build();
    }
}
