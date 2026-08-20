package com.hackhive.student.service;

import com.hackhive.student.dto.request.UpdateStudentWorkspacePreferenceRequest;
import com.hackhive.student.dto.response.StudentWorkspacePreferenceResponse;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentWorkspacePreference;

public interface StudentWorkspacePreferenceService {

    StudentWorkspacePreferenceResponse getPreferences();

    StudentWorkspacePreferenceResponse updatePreferences(UpdateStudentWorkspacePreferenceRequest request);

    StudentWorkspacePreference createDefaultPreferences(StudentProfile studentProfile);
}
