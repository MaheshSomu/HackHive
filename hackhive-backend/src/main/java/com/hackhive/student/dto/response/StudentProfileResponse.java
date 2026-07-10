package com.hackhive.student.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentProfileResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String bio;

    private String university;

    private String college;

    private String degree;

    private String branch;

    private String graduationYear;

    private Double cgpa;

    private String location;

    private String githubUrl;

    private String linkedinUrl;

    private String portfolioUrl;

    private String resumeUrl;

    private String profileImageUrl;
}