package com.hackhive.student.service;

import com.hackhive.student.dto.request.AddSkillRequest;
import com.hackhive.student.dto.request.UpdateSkillRequest;
import com.hackhive.student.dto.response.SkillResponse;

import java.util.List;

public interface StudentSkillService {

    SkillResponse addSkill(AddSkillRequest request);

    SkillResponse updateSkill(
            Long id,
            UpdateSkillRequest request
    );

    List<SkillResponse> getMySkills();

    void deleteSkill(Long id);
}