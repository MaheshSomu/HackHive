package com.hackhive.organizer.repository;

import com.hackhive.auth.entity.User;
import com.hackhive.organizer.entity.OrganizerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizerProfileRepository
        extends JpaRepository<OrganizerProfile, Long> {

    Optional<OrganizerProfile> findByUser(User user);
}