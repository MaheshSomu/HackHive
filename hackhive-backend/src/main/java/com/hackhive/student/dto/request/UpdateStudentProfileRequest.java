package com.hackhive.student.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateStudentProfileRequest {

    @Size(max = 500)
    private String bio;

    @Size(max = 150)
    private String university;

    @Size(max = 150)
    private String college;

    @Size(max = 100)
    private String degree;

    @Size(max = 100)
    private String branch;

    @Size(max = 10)
    private String graduationYear;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double cgpa;

    @Size(max = 100)
    private String location;

    @Size(max = 255)
    private String githubUrl;

    @Size(max = 255)
    private String linkedinUrl;

    @Size(max = 255)
    private String portfolioUrl;
}