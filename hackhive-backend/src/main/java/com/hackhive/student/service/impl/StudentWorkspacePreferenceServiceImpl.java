package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.UpdateStudentWorkspacePreferenceRequest;
import com.hackhive.student.dto.response.StudentWorkspacePreferenceResponse;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentWorkspacePreference;
import com.hackhive.student.mapper.StudentWorkspacePreferenceMapper;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.repository.StudentWorkspacePreferenceRepository;
import com.hackhive.student.service.StudentWorkspacePreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentWorkspacePreferenceServiceImpl
        implements StudentWorkspacePreferenceService {

    private final StudentWorkspacePreferenceRepository preferenceRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentWorkspacePreferenceMapper preferenceMapper;

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
    public StudentWorkspacePreference createDefaultPreferences(StudentProfile studentProfile) {
        return preferenceRepository.findByStudentProfile(studentProfile)
                .orElseGet(() -> {
                    StudentWorkspacePreference defaultPref =
                            StudentWorkspacePreference.builder()
                                    .studentProfile(studentProfile)
                                    .theme("system")
                                    .build();
                    return preferenceRepository.save(defaultPref);
                });
    }

    @Override
    @Transactional
    public StudentWorkspacePreferenceResponse getPreferences() {
        StudentProfile profile = getCurrentStudentProfile();

        StudentWorkspacePreference preference =
                preferenceRepository.findByStudentProfile(profile)
                        .orElseGet(() -> createDefaultPreferences(profile));

        return preferenceMapper.toResponse(preference);
    }

    @Override
    @Transactional
    public StudentWorkspacePreferenceResponse updatePreferences(
            UpdateStudentWorkspacePreferenceRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentWorkspacePreference preference =
                preferenceRepository.findByStudentProfile(profile)
                        .orElseGet(() -> createDefaultPreferences(profile));

        preference.setTheme(request.getTheme());

        preference = preferenceRepository.save(preference);

        return preferenceMapper.toResponse(preference);
    }
}
