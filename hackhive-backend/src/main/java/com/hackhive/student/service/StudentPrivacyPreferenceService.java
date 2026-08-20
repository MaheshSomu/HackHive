package com.hackhive.student.service;

import com.hackhive.student.dto.request.UpdateStudentPrivacyPreferenceRequest;
import com.hackhive.student.dto.response.StudentPrivacyPreferenceResponse;
import com.hackhive.student.entity.StudentPrivacyPreference;
import com.hackhive.student.entity.StudentProfile;

public interface StudentPrivacyPreferenceService {

    StudentPrivacyPreferenceResponse getPreferences();

    StudentPrivacyPreferenceResponse updatePreferences(UpdateStudentPrivacyPreferenceRequest request);

    StudentPrivacyPreference createDefaultPreferences(StudentProfile studentProfile);
}
