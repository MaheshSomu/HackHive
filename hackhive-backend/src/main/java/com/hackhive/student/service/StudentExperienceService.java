package com.hackhive.student.service;

import com.hackhive.student.dto.request.AddExperienceRequest;
import com.hackhive.student.dto.request.UpdateExperienceRequest;
import com.hackhive.student.dto.response.ExperienceResponse;

import java.util.List;

public interface StudentExperienceService {

    ExperienceResponse addExperience(
            AddExperienceRequest request
    );

    List<ExperienceResponse> getMyExperiences();

    ExperienceResponse updateExperience(
            Long id,
            UpdateExperienceRequest request
    );

    void deleteExperience(Long id);
}