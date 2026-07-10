package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.SkillResponse;
import com.hackhive.student.entity.StudentSkill;
import org.springframework.stereotype.Component;

@Component
public class StudentSkillMapper {

    public SkillResponse toResponse(StudentSkill studentSkill) {

        return SkillResponse.builder()
                .id(studentSkill.getId())
                .skillName(studentSkill.getSkillName())
                .skillLevel(studentSkill.getSkillLevel())
                .build();
    }
}