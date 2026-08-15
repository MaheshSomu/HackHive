package com.hackhive.organizer.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrganizerNotificationPreferenceRequest {

    @NotNull(message = "registrations preference is required.")
    private Boolean registrations;

    @NotNull(message = "teamRequests preference is required.")
    private Boolean teamRequests;

    @NotNull(message = "eventUpdates preference is required.")
    private Boolean eventUpdates;

    @NotNull(message = "weeklySummary preference is required.")
    private Boolean weeklySummary;
}
