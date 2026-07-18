package com.hackhive.event.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegisteredStudentResponse {

    private Long registrationId;

    private Long studentProfileId;

    private String fullName;

    private String email;

    private String college;

    private String branch;

    private String graduationYear;
}