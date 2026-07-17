package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.ExperienceResponse;
import com.hackhive.student.entity.StudentExperience;
import org.springframework.stereotype.Component;

@Component
public class StudentExperienceMapper {

    public ExperienceResponse toResponse(
            StudentExperience experience) {

        return ExperienceResponse.builder()
                .id(experience.getId())
                .company(experience.getCompany())
                .role(experience.getRole())
                .employmentType(experience.getEmploymentType())
                .location(experience.getLocation())
                .startDate(experience.getStartDate())
                .endDate(experience.getEndDate())
                .currentlyWorking(experience.getCurrentlyWorking())
                .description(experience.getDescription())
                .build();
    }
}