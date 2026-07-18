package com.hackhive.event.service;

import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;

import java.util.List;

public interface EventRegistrationService {

    EventRegistrationResponse registerForEvent(
            Long eventId
    );

    List<EventRegistrationResponse> getMyRegistrations();

    void cancelRegistration(
            Long eventId
    );

    List<RegisteredStudentResponse> getEventRegistrations(
            Long eventId
    );
}