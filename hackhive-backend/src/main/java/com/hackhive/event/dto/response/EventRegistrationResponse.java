package com.hackhive.event.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventRegistrationResponse {

    private Long registrationId;

    private Long eventId;

    private String eventTitle;

    private Long studentProfileId;

    private String studentName;

    private String studentEmail;
}