package com.hackhive.student.dto.request;

import com.hackhive.student.enums.SkillLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSkillRequest {

    @NotBlank
    private String skillName;

    @NotNull
    private SkillLevel skillLevel;
}