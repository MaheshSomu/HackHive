package com.hackhive.student.service;

import com.hackhive.student.dto.request.AddEducationRequest;
import com.hackhive.student.dto.request.UpdateEducationRequest;
import com.hackhive.student.dto.response.EducationResponse;

import java.util.List;

public interface StudentEducationService {

    EducationResponse addEducation(AddEducationRequest request);

    List<EducationResponse> getEducations();

    EducationResponse updateEducation(
            Long educationId,
            UpdateEducationRequest request
    );

    void deleteEducation(Long educationId);
}