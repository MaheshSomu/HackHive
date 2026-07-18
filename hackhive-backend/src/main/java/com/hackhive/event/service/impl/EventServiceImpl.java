package com.hackhive.event.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.dto.request.CreateEventRequest;
import com.hackhive.event.dto.request.UpdateEventRequest;
import com.hackhive.event.dto.response.EventResponse;
import com.hackhive.event.entity.Event;
import com.hackhive.event.mapper.EventMapper;
import com.hackhive.event.repository.EventRepository;
import com.hackhive.event.service.EventService;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;

    private OrganizerProfile getCurrentOrganizerProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."));

        return organizerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Organizer profile not found."));
    }

    @Override
    public EventResponse createEvent(
            CreateEventRequest request) {

        OrganizerProfile organizerProfile =
                getCurrentOrganizerProfile();

        Event event = Event.builder()
                .organizerProfile(organizerProfile)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .eventMode(request.getEventMode())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .registrationStartDate(
                        request.getRegistrationStartDate())
                .registrationEndDate(
                        request.getRegistrationEndDate())
                .minTeamSize(request.getMinTeamSize())
                .maxTeamSize(request.getMaxTeamSize())
                .eligibility(request.getEligibility())
                .bannerUrl(request.getBannerUrl())
                .collegeName(request.getCollegeName())
                .build();

        event = eventRepository.save(event);

        return eventMapper.toResponse(event);
    }

    @Override
    public List<EventResponse> getMyEvents() {

        OrganizerProfile organizerProfile =
                getCurrentOrganizerProfile();

        return eventRepository
                .findByOrganizerProfile(organizerProfile)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Override
    public EventResponse updateEvent(
            Long id,
            UpdateEventRequest request) {

        OrganizerProfile organizerProfile =
                getCurrentOrganizerProfile();

        Event event = eventRepository
                .findByIdAndOrganizerProfile(
                        id, organizerProfile)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventMode(request.getEventMode());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());

        event.setRegistrationStartDate(
                request.getRegistrationStartDate());

        event.setRegistrationEndDate(
                request.getRegistrationEndDate());

        event.setMinTeamSize(
                request.getMinTeamSize());

        event.setMaxTeamSize(
                request.getMaxTeamSize());

        event.setEligibility(
                request.getEligibility());

        event.setBannerUrl(
                request.getBannerUrl());

        event.setCollegeName(
                request.getCollegeName());

        event = eventRepository.save(event);

        return eventMapper.toResponse(event);
    }

    @Override
    public void deleteEvent(Long id) {

        OrganizerProfile organizerProfile =
                getCurrentOrganizerProfile();

        Event event = eventRepository
                .findByIdAndOrganizerProfile(
                        id, organizerProfile)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        eventRepository.delete(event);
    }

    @Override
    public List<EventResponse> getAllEvents() {

        return eventRepository
                .findAll()
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Override
    public EventResponse getEventById(Long id) {

        Event event = eventRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        return eventMapper.toResponse(event);
    }

    @Override
    public List<EventResponse> searchEventsByTitle(
            String title) {

        return eventRepository
                .findByTitleContainingIgnoreCase(title)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Override
    public List<EventResponse> searchEventsByCollege(
            String collegeName) {

        return eventRepository
                .findByCollegeNameContainingIgnoreCase(
                        collegeName)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }
}