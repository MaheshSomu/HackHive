package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.UpdateStudentPrivacyPreferenceRequest;
import com.hackhive.student.dto.response.StudentPrivacyPreferenceResponse;
import com.hackhive.student.entity.StudentPrivacyPreference;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.mapper.StudentPrivacyPreferenceMapper;
import com.hackhive.student.repository.StudentPrivacyPreferenceRepository;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.service.StudentPrivacyPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentPrivacyPreferenceServiceImpl
        implements StudentPrivacyPreferenceService {

    private final StudentPrivacyPreferenceRepository preferenceRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentPrivacyPreferenceMapper preferenceMapper;

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
    }

    private StudentProfile getCurrentStudentProfile() {
        User user = getCurrentUser();

        return studentProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student profile not found."));
    }

    @Override
    @Transactional
    public StudentPrivacyPreference createDefaultPreferences(StudentProfile studentProfile) {
        return preferenceRepository.findByStudentProfile(studentProfile)
                .orElseGet(() -> {
                    StudentPrivacyPreference defaultPref =
                            StudentPrivacyPreference.builder()
                                    .studentProfile(studentProfile)
                                    .publicProfile(true)
                                    .organizerDiscovery(true)
                                    .showSkillsToOrganizers(true)
                                    .contactEmailVisibility(false)
                                    .build();
                    return preferenceRepository.save(defaultPref);
                });
    }

    @Override
    @Transactional
    public StudentPrivacyPreferenceResponse getPreferences() {
        StudentProfile profile = getCurrentStudentProfile();

        StudentPrivacyPreference preference =
                preferenceRepository.findByStudentProfile(profile)
                        .orElseGet(() -> createDefaultPreferences(profile));

        return preferenceMapper.toResponse(preference);
    }

    @Override
    @Transactional
    public StudentPrivacyPreferenceResponse updatePreferences(
            UpdateStudentPrivacyPreferenceRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentPrivacyPreference preference =
                preferenceRepository.findByStudentProfile(profile)
                        .orElseGet(() -> createDefaultPreferences(profile));

        preference.setPublicProfile(request.getPublicProfile());
        preference.setOrganizerDiscovery(request.getOrganizerDiscovery());
        preference.setShowSkillsToOrganizers(request.getShowSkillsToOrganizers());
        preference.setContactEmailVisibility(request.getContactEmailVisibility());

        preference = preferenceRepository.save(preference);

        return preferenceMapper.toResponse(preference);
    }
}
