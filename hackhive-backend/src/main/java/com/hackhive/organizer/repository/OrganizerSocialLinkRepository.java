package com.hackhive.organizer.repository;

import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.entity.OrganizerSocialLink;
import com.hackhive.organizer.enums.SocialPlatform;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganizerSocialLinkRepository
        extends JpaRepository<OrganizerSocialLink, Long> {

    List<OrganizerSocialLink> findByOrganizerProfile(OrganizerProfile organizerProfile);

    Optional<OrganizerSocialLink> findByOrganizerProfileAndPlatform(
            OrganizerProfile organizerProfile,
            SocialPlatform platform
    );

    Optional<OrganizerSocialLink> findByIdAndOrganizerProfile(
            Long id,
            OrganizerProfile organizerProfile
    );

    void deleteByOrganizerProfileAndPlatform(
            OrganizerProfile organizerProfile,
            SocialPlatform platform
    );
}
