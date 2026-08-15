package com.hackhive.organizer.entity;

import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "organizer_notification_preferences",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_organizer_profile_notification_pref",
            columnNames = {"organizer_profile_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerNotificationPreference extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_profile_id", nullable = false, unique = true)
    private OrganizerProfile organizerProfile;

    @Builder.Default
    @Column(nullable = false)
    private Boolean registrations = true;

    @Builder.Default
    @Column(name = "team_requests", nullable = false)
    private Boolean teamRequests = true;

    @Builder.Default
    @Column(name = "event_updates", nullable = false)
    private Boolean eventUpdates = true;

    @Builder.Default
    @Column(name = "weekly_summary", nullable = false)
    private Boolean weeklySummary = false;
}
