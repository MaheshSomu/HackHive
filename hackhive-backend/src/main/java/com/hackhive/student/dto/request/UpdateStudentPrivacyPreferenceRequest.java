package com.hackhive.student.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStudentPrivacyPreferenceRequest {

    @NotNull(message = "publicProfile cannot be null.")
    private Boolean publicProfile;

    @NotNull(message = "organizerDiscovery cannot be null.")
    private Boolean organizerDiscovery;

    @NotNull(message = "showSkillsToOrganizers cannot be null.")
    private Boolean showSkillsToOrganizers;

    @NotNull(message = "contactEmailVisibility cannot be null.")
    private Boolean contactEmailVisibility;
}
