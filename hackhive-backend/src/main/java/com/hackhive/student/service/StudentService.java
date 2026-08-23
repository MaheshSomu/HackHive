package com.hackhive.student.service;

import com.hackhive.student.dto.request.UpdateStudentProfileRequest;
import com.hackhive.student.dto.response.StudentProfileResponse;

public interface StudentService {

    StudentProfileResponse getMyProfile();

    StudentProfileResponse updateMyProfile(
            UpdateStudentProfileRequest request
    );

    void deactivateAccount();

    com.hackhive.student.dto.response.StudentLookupResponse lookupStudentByEmail(String email);
}