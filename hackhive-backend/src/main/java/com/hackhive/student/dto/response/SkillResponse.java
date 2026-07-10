package com.hackhive.student.dto.response;

import com.hackhive.student.enums.SkillLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillResponse {

    private Long id;

    private String skillName;

    private SkillLevel skillLevel;
}