package com.hackhive.organizer.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.common.service.FileStorageService;
import com.hackhive.organizer.dto.request.CreateOrganizerProfileRequest;
import com.hackhive.organizer.dto.request.UpdateOrganizerProfileRequest;
import com.hackhive.organizer.dto.response.OrganizerProfileResponse;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.mapper.OrganizerProfileMapper;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.organizer.service.OrganizerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hackhive.organizer.entity.OrganizerNotificationPreference;
import com.hackhive.organizer.repository.OrganizerNotificationPreferenceRepository;

@Service
@RequiredArgsConstructor
public class OrganizerProfileServiceImpl
        implements OrganizerProfileService {

    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final OrganizerProfileMapper organizerProfileMapper;
    private final FileStorageService fileStorageService;
    private final OrganizerNotificationPreferenceRepository preferenceRepository;

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
    }

    @Override
    public OrganizerProfileResponse createProfile(
            CreateOrganizerProfileRequest request) {

        User user = getCurrentUser();

        if (organizerProfileRepository.findByUser(user).isPresent()) {
            throw new IllegalArgumentException(
                    "Organizer profile already exists.");
        }

        OrganizerProfile organizerProfile =
                OrganizerProfile.builder()
                        .user(user)
                        .organizationName(request.getOrganizationName())
                        .organizationType(request.getOrganizationType())
                        .description(request.getDescription())
                        .websiteUrl(request.getWebsiteUrl())
                        .contactEmail(request.getContactEmail())
                        .contactPhone(request.getContactPhone())
                        .logoUrl(request.getLogoUrl())
                        .location(request.getLocation())
                        .verified(false)
                        .build();

        organizerProfile =
                organizerProfileRepository.save(organizerProfile);

        // Initialize default notification preferences
        OrganizerNotificationPreference defaultPref =
                OrganizerNotificationPreference.builder()
                        .organizerProfile(organizerProfile)
                        .registrations(true)
                        .teamRequests(true)
                        .eventUpdates(true)
                        .weeklySummary(false)
                        .build();
        preferenceRepository.save(defaultPref);

        return organizerProfileMapper.toResponse(organizerProfile);
    }

    @Override
    public OrganizerProfileResponse getMyProfile() {

        User user = getCurrentUser();

        OrganizerProfile organizerProfile =
                organizerProfileRepository.findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Organizer profile not found."));

        return organizerProfileMapper.toResponse(organizerProfile);
    }

    @Override
    public OrganizerProfileResponse updateProfile(
            UpdateOrganizerProfileRequest request) {

        User user = getCurrentUser();

        OrganizerProfile organizerProfile =
                organizerProfileRepository.findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Organizer profile not found."));

        String oldLogoUrl = organizerProfile.getLogoUrl();
        String newLogoUrl = request.getLogoUrl();

        if (oldLogoUrl != null && !oldLogoUrl.equals(newLogoUrl)) {
            fileStorageService.deleteFile(oldLogoUrl);
        }

        organizerProfile.setOrganizationName(
                request.getOrganizationName());

        organizerProfile.setOrganizationType(
                request.getOrganizationType());

        organizerProfile.setDescription(
                request.getDescription());

        organizerProfile.setWebsiteUrl(
                request.getWebsiteUrl());

        organizerProfile.setContactEmail(
                request.getContactEmail());

        organizerProfile.setContactPhone(
                request.getContactPhone());

        organizerProfile.setLogoUrl(
                newLogoUrl);

        organizerProfile.setLocation(
                request.getLocation());

        organizerProfile =
                organizerProfileRepository.save(organizerProfile);

        return organizerProfileMapper.toResponse(organizerProfile);
    }

    @Override
    public OrganizerProfileResponse uploadLogo(MultipartFile file) {

        User user = getCurrentUser();

        OrganizerProfile organizerProfile =
                organizerProfileRepository.findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Organizer profile not found."));

        if (organizerProfile.getLogoUrl() != null) {
            fileStorageService.deleteFile(organizerProfile.getLogoUrl());
        }

        String logoUrl = fileStorageService.storeFile(file, "organizer-logos");

        organizerProfile.setLogoUrl(logoUrl);

        organizerProfile = organizerProfileRepository.save(organizerProfile);

        return organizerProfileMapper.toResponse(organizerProfile);
    }

    @Override
    public OrganizerProfileResponse removeLogo() {

        User user = getCurrentUser();

        OrganizerProfile organizerProfile =
                organizerProfileRepository.findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Organizer profile not found."));

        if (organizerProfile.getLogoUrl() != null) {
            fileStorageService.deleteFile(organizerProfile.getLogoUrl());
        }

        organizerProfile.setLogoUrl(null);

        organizerProfile = organizerProfileRepository.save(organizerProfile);

        return organizerProfileMapper.toResponse(organizerProfile);
    }
}