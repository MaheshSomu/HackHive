package com.hackhive.event.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.event.dto.request.InitiateRegistrationRequest;
import com.hackhive.event.dto.request.VerifyPaymentRequest;
import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.InitiatePaymentResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;
import com.hackhive.event.service.EventRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-registrations")
@RequiredArgsConstructor
public class EventRegistrationController {

    private final EventRegistrationService eventRegistrationService;

    // =========================
    // STUDENT OPERATIONS
    // =========================

    @PostMapping("/events/{eventId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<EventRegistrationResponse>>
    registerForEvent(@PathVariable Long eventId,
                     @Valid @RequestBody(required = false) InitiateRegistrationRequest request) {

        EventRegistrationResponse response =
                eventRegistrationService
                        .registerForEvent(eventId, request);

        return ResponseEntity.ok(
                ApiResponse.<EventRegistrationResponse>builder()
                        .success(true)
                        .message(
                                "Event registration successful.")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/events/{eventId}/initiate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<InitiatePaymentResponse>>
    initiateRegistration(@PathVariable Long eventId,
                         @Valid @RequestBody(required = false) InitiateRegistrationRequest request) {

        InitiatePaymentResponse response =
                eventRegistrationService
                        .initiateRegistration(eventId, request);

        return ResponseEntity.ok(
                ApiResponse.<InitiatePaymentResponse>builder()
                        .success(true)
                        .message(response.getMessage())
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/verify-payment")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<EventRegistrationResponse>>
    verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {

        EventRegistrationResponse response =
                eventRegistrationService
                        .verifyPayment(request);

        return ResponseEntity.ok(
                ApiResponse.<EventRegistrationResponse>builder()
                        .success(true)
                        .message("Payment verified and registration confirmed.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/my-registrations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<EventRegistrationResponse>>>
    getMyRegistrations() {

        List<EventRegistrationResponse> response =
                eventRegistrationService
                        .getMyRegistrations();

        return ResponseEntity.ok(
                ApiResponse
                        .<List<EventRegistrationResponse>>builder()
                        .success(true)
                        .message(
                                "Event registrations fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/events/{eventId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Void>>
    cancelRegistration(@PathVariable Long eventId) {

        eventRegistrationService
                .cancelRegistration(eventId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message(
                                "Event registration cancelled successfully.")
                        .build()
        );
    }

    // =========================
    // ORGANIZER OPERATIONS
    // =========================

    @GetMapping("/events/{eventId}/students")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponse<List<RegisteredStudentResponse>>>
    getEventRegistrations(@PathVariable Long eventId) {

        List<RegisteredStudentResponse> response =
                eventRegistrationService
                        .getEventRegistrations(eventId);

        return ResponseEntity.ok(
                ApiResponse
                        .<List<RegisteredStudentResponse>>builder()
                        .success(true)
                        .message(
                                "Registered students fetched successfully.")
                        .data(response)
                        .build()
        );
    }
}