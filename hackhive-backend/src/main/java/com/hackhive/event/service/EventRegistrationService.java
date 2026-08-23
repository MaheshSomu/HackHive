package com.hackhive.event.service;

import com.hackhive.event.dto.request.VerifyPaymentRequest;
import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.InitiatePaymentResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;

import java.util.List;

public interface EventRegistrationService {

    EventRegistrationResponse registerForEvent(
            Long eventId
    );

    EventRegistrationResponse registerForEvent(
            Long eventId,
            com.hackhive.event.dto.request.InitiateRegistrationRequest request
    );

    InitiatePaymentResponse initiateRegistration(
            Long eventId
    );

    InitiatePaymentResponse initiateRegistration(
            Long eventId,
            com.hackhive.event.dto.request.InitiateRegistrationRequest request
    );

    EventRegistrationResponse verifyPayment(
            VerifyPaymentRequest request
    );

    List<EventRegistrationResponse> getMyRegistrations();

    void cancelRegistration(
            Long eventId
    );

    List<RegisteredStudentResponse> getEventRegistrations(
            Long eventId
    );
}