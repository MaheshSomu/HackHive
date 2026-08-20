package com.hackhive.student.service;

import com.hackhive.student.dto.request.UpdateStudentNotificationPreferenceRequest;
import com.hackhive.student.dto.response.StudentNotificationPreferenceResponse;
import com.hackhive.student.entity.StudentNotificationPreference;
import com.hackhive.student.entity.StudentProfile;

public interface StudentNotificationPreferenceService {

    StudentNotificationPreferenceResponse getPreferences();

    StudentNotificationPreferenceResponse updatePreferences(UpdateStudentNotificationPreferenceRequest request);

    StudentNotificationPreference createDefaultPreferences(StudentProfile studentProfile);
}
