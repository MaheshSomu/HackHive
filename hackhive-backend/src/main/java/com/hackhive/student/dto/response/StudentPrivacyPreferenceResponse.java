package com.hackhive.student.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentPrivacyPreferenceResponse {

    private Boolean publicProfile;
    private Boolean organizerDiscovery;
    private Boolean showSkillsToOrganizers;
    private Boolean contactEmailVisibility;
}
