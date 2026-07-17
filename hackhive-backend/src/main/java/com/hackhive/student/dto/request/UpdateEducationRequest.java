package com.hackhive.student.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEducationRequest {

    private String institution;

    private String degree;

    private String fieldOfStudy;

    private Integer startYear;

    private Integer endYear;

    private Double cgpa;

    private String description;
}