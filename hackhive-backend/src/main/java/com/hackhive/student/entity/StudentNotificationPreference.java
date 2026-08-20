package com.hackhive.student.entity;

import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "student_notification_preferences",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_student_profile_notification_pref",
            columnNames = {"student_profile_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentNotificationPreference extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false, unique = true)
    private StudentProfile studentProfile;

    @Builder.Default
    @Column(name = "event_registration_updates", nullable = false)
    private Boolean eventRegistrationUpdates = true;

    @Builder.Default
    @Column(name = "event_reminders", nullable = false)
    private Boolean eventReminders = true;

    @Builder.Default
    @Column(name = "submission_deadline_reminders", nullable = false)
    private Boolean submissionDeadlineReminders = true;

    @Builder.Default
    @Column(name = "team_invitations", nullable = false)
    private Boolean teamInvitations = true;

    @Builder.Default
    @Column(name = "team_activity", nullable = false)
    private Boolean teamActivity = true;

    @Builder.Default
    @Column(name = "hackathon_announcements", nullable = false)
    private Boolean hackathonAnnouncements = false;

    @Builder.Default
    @Column(name = "weekly_recommendations", nullable = false)
    private Boolean weeklyRecommendations = true;
}
