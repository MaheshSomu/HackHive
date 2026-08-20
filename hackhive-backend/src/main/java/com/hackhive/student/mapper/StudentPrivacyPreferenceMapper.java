package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.StudentPrivacyPreferenceResponse;
import com.hackhive.student.entity.StudentPrivacyPreference;
import org.springframework.stereotype.Component;

@Component
public class StudentPrivacyPreferenceMapper {

    public StudentPrivacyPreferenceResponse toResponse(StudentPrivacyPreference preference) {
        if (preference == null) {
            return null;
        }

        return StudentPrivacyPreferenceResponse.builder()
                .publicProfile(preference.getPublicProfile())
                .organizerDiscovery(preference.getOrganizerDiscovery())
                .showSkillsToOrganizers(preference.getShowSkillsToOrganizers())
                .contactEmailVisibility(preference.getContactEmailVisibility())
                .build();
    }
}
