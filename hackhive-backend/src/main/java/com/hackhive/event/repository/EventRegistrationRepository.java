package com.hackhive.event.repository;

import com.hackhive.event.entity.Event;
import com.hackhive.event.entity.EventRegistration;
import com.hackhive.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository
        extends JpaRepository<EventRegistration, Long> {

    // Get all registrations for a particular event
    List<EventRegistration> findByEvent(Event event);

    // Get all events registered by a particular student
    List<EventRegistration> findByStudentProfile(
            StudentProfile studentProfile
    );

    // Check whether a student has already registered for an event
    boolean existsByEventAndStudentProfile(
            Event event,
            StudentProfile studentProfile
    );

    // Find a student's specific event registration
    Optional<EventRegistration> findByEventAndStudentProfile(
            Event event,
            StudentProfile studentProfile
    );
}