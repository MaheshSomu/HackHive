package com.hackhive.student.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EducationResponse {

    private Long id;

    private String institution;

    private String degree;

    private String fieldOfStudy;

    private Integer startYear;

    private Integer endYear;

    private Double cgpa;

    private String description;
}