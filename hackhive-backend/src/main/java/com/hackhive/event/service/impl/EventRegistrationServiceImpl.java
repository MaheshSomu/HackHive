package com.hackhive.event.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;
import com.hackhive.event.entity.Event;
import com.hackhive.event.entity.EventRegistration;
import com.hackhive.event.mapper.EventRegistrationMapper;
import com.hackhive.event.repository.EventRegistrationRepository;
import com.hackhive.event.repository.EventRepository;
import com.hackhive.event.service.EventRegistrationService;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventRegistrationServiceImpl
        implements EventRegistrationService {

    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRepository eventRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final EventRegistrationMapper eventRegistrationMapper;

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."));
    }

    private StudentProfile getCurrentStudentProfile() {

        User user = getCurrentUser();

        return studentProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found."));
    }

    private OrganizerProfile getCurrentOrganizerProfile() {

        User user = getCurrentUser();

        return organizerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Organizer profile not found."));
    }

    @Override
    public EventRegistrationResponse registerForEvent(
            Long eventId) {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        Event event = eventRepository
                .findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        boolean alreadyRegistered =
                eventRegistrationRepository
                        .existsByEventAndStudentProfile(
                                event,
                                studentProfile
                        );

        if (alreadyRegistered) {
            throw new BadRequestException(
                    "You are already registered for this event.");
        }

        EventRegistration registration =
                EventRegistration.builder()
                        .event(event)
                        .studentProfile(studentProfile)
                        .build();

        registration =
                eventRegistrationRepository.save(registration);

        return eventRegistrationMapper
                .toResponse(registration);
    }

    @Override
    public List<EventRegistrationResponse> getMyRegistrations() {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        return eventRegistrationRepository
                .findByStudentProfile(studentProfile)
                .stream()
                .map(eventRegistrationMapper::toResponse)
                .toList();
    }

    @Override
    public void cancelRegistration(Long eventId) {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        Event event = eventRepository
                .findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        EventRegistration registration =
                eventRegistrationRepository
                        .findByEventAndStudentProfile(
                                event,
                                studentProfile
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Event registration not found."));

        eventRegistrationRepository.delete(registration);
    }

    @Override
    public List<RegisteredStudentResponse> getEventRegistrations(
            Long eventId) {

        OrganizerProfile organizerProfile =
                getCurrentOrganizerProfile();

        Event event = eventRepository
                .findByIdAndOrganizerProfile(
                        eventId,
                        organizerProfile
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        return eventRegistrationRepository
                .findByEvent(event)
                .stream()
                .map(eventRegistrationMapper
                        ::toRegisteredStudentResponse)
                .toList();
    }
}