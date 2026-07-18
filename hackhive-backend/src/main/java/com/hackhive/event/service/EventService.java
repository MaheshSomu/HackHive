package com.hackhive.event.service;

import com.hackhive.event.dto.request.CreateEventRequest;
import com.hackhive.event.dto.request.UpdateEventRequest;
import com.hackhive.event.dto.response.EventResponse;

import java.util.List;

public interface EventService {

    // Organizer operations

    EventResponse createEvent(
            CreateEventRequest request
    );

    List<EventResponse> getMyEvents();

    EventResponse updateEvent(
            Long id,
            UpdateEventRequest request
    );

    void deleteEvent(Long id);


    // Student / public event discovery operations

    List<EventResponse> getAllEvents();

    EventResponse getEventById(Long id);

    List<EventResponse> searchEventsByTitle(
            String title
    );

    List<EventResponse> searchEventsByCollege(
            String collegeName
    );
}