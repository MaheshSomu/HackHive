package com.hackhive.event.repository;

import com.hackhive.event.entity.Event;
import com.hackhive.organizer.entity.OrganizerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository
        extends JpaRepository<Event, Long> {

    List<Event> findByOrganizerProfile(
            OrganizerProfile organizerProfile
    );

    Optional<Event> findByIdAndOrganizerProfile(
            Long id,
            OrganizerProfile organizerProfile
    );

    List<Event> findByCollegeNameContainingIgnoreCase(
            String collegeName
    );

    List<Event> findByTitleContainingIgnoreCase(
            String title
    );
}