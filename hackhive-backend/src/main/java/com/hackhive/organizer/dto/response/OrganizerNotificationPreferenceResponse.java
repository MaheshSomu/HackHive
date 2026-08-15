package com.hackhive.organizer.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerNotificationPreferenceResponse {

    private Long id;
    private Boolean registrations;
    private Boolean teamRequests;
    private Boolean eventUpdates;
    private Boolean weeklySummary;
}
