package com.hackhive.student.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ExperienceResponse {

    private Long id;

    private String company;

    private String role;

    private String employmentType;

    private String location;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean currentlyWorking;

    private String description;
}