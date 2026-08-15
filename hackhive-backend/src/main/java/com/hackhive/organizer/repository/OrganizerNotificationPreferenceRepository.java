package com.hackhive.organizer.repository;

import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.entity.OrganizerNotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizerNotificationPreferenceRepository
        extends JpaRepository<OrganizerNotificationPreference, Long> {

    Optional<OrganizerNotificationPreference> findByOrganizerProfile(OrganizerProfile organizerProfile);
}
