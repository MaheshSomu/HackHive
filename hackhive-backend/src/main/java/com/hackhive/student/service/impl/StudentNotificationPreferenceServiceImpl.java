package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.UpdateStudentNotificationPreferenceRequest;
import com.hackhive.student.dto.response.StudentNotificationPreferenceResponse;
import com.hackhive.student.entity.StudentNotificationPreference;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.mapper.StudentNotificationPreferenceMapper;
import com.hackhive.student.repository.StudentNotificationPreferenceRepository;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.service.StudentNotificationPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentNotificationPreferenceServiceImpl
        implements StudentNotificationPreferenceService {

    private final StudentNotificationPreferenceRepository preferenceRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentNotificationPreferenceMapper preferenceMapper;

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
    public StudentNotificationPreference createDefaultPreferences(StudentProfile studentProfile) {
        return preferenceRepository.findByStudentProfile(studentProfile)
                .orElseGet(() -> {
                    StudentNotificationPreference defaultPref =
                            StudentNotificationPreference.builder()
                                    .studentProfile(studentProfile)
                                    .eventRegistrationUpdates(true)
                                    .eventReminders(true)
                                    .submissionDeadlineReminders(true)
                                    .teamInvitations(true)
                                    .teamActivity(true)
                                    .hackathonAnnouncements(false)
                                    .weeklyRecommendations(true)
                                    .build();
                    return preferenceRepository.save(defaultPref);
                });
    }

    @Override
    @Transactional
    public StudentNotificationPreferenceResponse getPreferences() {
        StudentProfile profile = getCurrentStudentProfile();

        StudentNotificationPreference preference =
                preferenceRepository.findByStudentProfile(profile)
                        .orElseGet(() -> createDefaultPreferences(profile));

        return preferenceMapper.toResponse(preference);
    }

    @Override
    @Transactional
    public StudentNotificationPreferenceResponse updatePreferences(
            UpdateStudentNotificationPreferenceRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentNotificationPreference preference =
                preferenceRepository.findByStudentProfile(profile)
                        .orElseGet(() -> createDefaultPreferences(profile));

        preference.setEventRegistrationUpdates(request.getEventRegistrationUpdates());
        preference.setEventReminders(request.getEventReminders());
        preference.setSubmissionDeadlineReminders(request.getSubmissionDeadlineReminders());
        preference.setTeamInvitations(request.getTeamInvitations());
        preference.setTeamActivity(request.getTeamActivity());
        preference.setHackathonAnnouncements(request.getHackathonAnnouncements());
        preference.setWeeklyRecommendations(request.getWeeklyRecommendations());

        preference = preferenceRepository.save(preference);

        return preferenceMapper.toResponse(preference);
    }
}
