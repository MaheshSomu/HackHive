package com.hackhive.student.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddEducationRequest {

    @NotBlank(message = "Institution is required")
    private String institution;

    @NotBlank(message = "Degree is required")
    private String degree;

    private String fieldOfStudy;

    @NotNull(message = "Start year is required")
    private Integer startYear;

    private Integer endYear;

    private Double cgpa;

    private String description;
}