package com.hackhive.student.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentNotificationPreferenceResponse {

    private Boolean eventRegistrationUpdates;
    private Boolean eventReminders;
    private Boolean submissionDeadlineReminders;
    private Boolean teamInvitations;
    private Boolean teamActivity;
    private Boolean hackathonAnnouncements;
    private Boolean weeklyRecommendations;
}
