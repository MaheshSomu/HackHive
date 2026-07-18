package com.hackhive.event.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.event.dto.request.CreateEventRequest;
import com.hackhive.event.dto.request.UpdateEventRequest;
import com.hackhive.event.dto.response.EventResponse;
import com.hackhive.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @Valid @RequestBody CreateEventRequest request) {

        EventResponse response =
                eventService.createEvent(request);

        return ResponseEntity.ok(
                ApiResponse.<EventResponse>builder()
                        .success(true)
                        .message("Event created successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/my-events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getMyEvents() {

        List<EventResponse> response =
                eventService.getMyEvents();

        return ResponseEntity.ok(
                ApiResponse.<List<EventResponse>>builder()
                        .success(true)
                        .message("Organizer events fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEventRequest request) {

        EventResponse response =
                eventService.updateEvent(id, request);

        return ResponseEntity.ok(
                ApiResponse.<EventResponse>builder()
                        .success(true)
                        .message("Event updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id) {

        eventService.deleteEvent(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Event deleted successfully.")
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents() {

        List<EventResponse> response =
                eventService.getAllEvents();

        return ResponseEntity.ok(
                ApiResponse.<List<EventResponse>>builder()
                        .success(true)
                        .message("Events fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(
            @PathVariable Long id) {

        EventResponse response =
                eventService.getEventById(id);

        return ResponseEntity.ok(
                ApiResponse.<EventResponse>builder()
                        .success(true)
                        .message("Event fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/search/title")
    public ResponseEntity<ApiResponse<List<EventResponse>>> searchByTitle(
            @RequestParam String title) {

        List<EventResponse> response =
                eventService.searchEventsByTitle(title);

        return ResponseEntity.ok(
                ApiResponse.<List<EventResponse>>builder()
                        .success(true)
                        .message("Events fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/search/college")
    public ResponseEntity<ApiResponse<List<EventResponse>>> searchByCollege(
            @RequestParam String collegeName) {

        List<EventResponse> response =
                eventService.searchEventsByCollege(collegeName);

        return ResponseEntity.ok(
                ApiResponse.<List<EventResponse>>builder()
                        .success(true)
                        .message("Events fetched successfully.")
                        .data(response)
                        .build()
        );
    }
}