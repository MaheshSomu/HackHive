package com.hackhive.student.entity;

import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "student_privacy_preferences",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_student_profile_privacy_pref",
            columnNames = {"student_profile_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentPrivacyPreference extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false, unique = true)
    private StudentProfile studentProfile;

    @Builder.Default
    @Column(name = "public_profile", nullable = false)
    private Boolean publicProfile = true;

    @Builder.Default
    @Column(name = "organizer_discovery", nullable = false)
    private Boolean organizerDiscovery = true;

    @Builder.Default
    @Column(name = "show_skills_to_organizers", nullable = false)
    private Boolean showSkillsToOrganizers = true;

    @Builder.Default
    @Column(name = "contact_email_visibility", nullable = false)
    private Boolean contactEmailVisibility = false;
}
