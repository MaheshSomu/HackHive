package com.hackhive.organizer.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.organizer.dto.request.UpdateOrganizerNotificationPreferenceRequest;
import com.hackhive.organizer.dto.response.OrganizerNotificationPreferenceResponse;
import com.hackhive.organizer.entity.OrganizerNotificationPreference;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.mapper.OrganizerNotificationPreferenceMapper;
import com.hackhive.organizer.repository.OrganizerNotificationPreferenceRepository;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.organizer.service.OrganizerNotificationPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrganizerNotificationPreferenceServiceImpl
        implements OrganizerNotificationPreferenceService {

    private final OrganizerNotificationPreferenceRepository preferenceRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final OrganizerNotificationPreferenceMapper preferenceMapper;

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
    }

    private OrganizerProfile getCurrentOrganizerProfile() {
        User user = getCurrentUser();

        return organizerProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Organizer profile not found."));
    }

    @Override
    @Transactional
    public OrganizerNotificationPreference createDefaultPreferences(OrganizerProfile organizerProfile) {
        return preferenceRepository.findByOrganizerProfile(organizerProfile)
                .orElseGet(() -> {
                    OrganizerNotificationPreference defaultPref =
                            OrganizerNotificationPreference.builder()
                                    .organizerProfile(organizerProfile)
                                    .registrations(true)
                                    .teamRequests(true)
                                    .eventUpdates(true)
                                    .weeklySummary(false)
                                    .build();
                    return preferenceRepository.save(defaultPref);
                });
    }

    @Override
    @Transactional
    public OrganizerNotificationPreferenceResponse getPreferences() {
        OrganizerProfile profile = getCurrentOrganizerProfile();

        OrganizerNotificationPreference preference =
                preferenceRepository.findByOrganizerProfile(profile)
                        .orElseGet(() -> createDefaultPreferences(profile));

        return preferenceMapper.toResponse(preference);
    }

    @Override
    @Transactional
    public OrganizerNotificationPreferenceResponse updatePreferences(
            UpdateOrganizerNotificationPreferenceRequest request) {

        OrganizerProfile profile = getCurrentOrganizerProfile();

        OrganizerNotificationPreference preference =
                preferenceRepository.findByOrganizerProfile(profile)
                        .orElseGet(() -> createDefaultPreferences(profile));

        preference.setRegistrations(request.getRegistrations());
        preference.setTeamRequests(request.getTeamRequests());
        preference.setEventUpdates(request.getEventUpdates());
        preference.setWeeklySummary(request.getWeeklySummary());

        preference = preferenceRepository.save(preference);

        return preferenceMapper.toResponse(preference);
    }
}
