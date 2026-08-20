package com.hackhive.student.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStudentNotificationPreferenceRequest {

    @NotNull(message = "eventRegistrationUpdates cannot be null.")
    private Boolean eventRegistrationUpdates;

    @NotNull(message = "eventReminders cannot be null.")
    private Boolean eventReminders;

    @NotNull(message = "submissionDeadlineReminders cannot be null.")
    private Boolean submissionDeadlineReminders;

    @NotNull(message = "teamInvitations cannot be null.")
    private Boolean teamInvitations;

    @NotNull(message = "teamActivity cannot be null.")
    private Boolean teamActivity;

    @NotNull(message = "hackathonAnnouncements cannot be null.")
    private Boolean hackathonAnnouncements;

    @NotNull(message = "weeklyRecommendations cannot be null.")
    private Boolean weeklyRecommendations;
}
