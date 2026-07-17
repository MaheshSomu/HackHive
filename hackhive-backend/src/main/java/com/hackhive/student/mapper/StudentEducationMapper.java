package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.EducationResponse;
import com.hackhive.student.entity.StudentEducation;
import org.springframework.stereotype.Component;

@Component
public class StudentEducationMapper {

    public EducationResponse toResponse(StudentEducation education) {

        return EducationResponse.builder()
                .id(education.getId())
                .institution(education.getInstitution())
                .degree(education.getDegree())
                .fieldOfStudy(education.getFieldOfStudy())
                .startYear(education.getStartYear())
                .endYear(education.getEndYear())
                .cgpa(education.getCgpa())
                .description(education.getDescription())
                .build();
    }
}