package com.hackhive.event.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;
import com.hackhive.event.service.EventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<EventRegistrationResponse>>
    registerForEvent(@PathVariable Long eventId) {

        EventRegistrationResponse response =
                eventRegistrationService
                        .registerForEvent(eventId);

        return ResponseEntity.ok(
                ApiResponse.<EventRegistrationResponse>builder()
                        .success(true)
                        .message(
                                "Event registration successful.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/my-registrations")
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