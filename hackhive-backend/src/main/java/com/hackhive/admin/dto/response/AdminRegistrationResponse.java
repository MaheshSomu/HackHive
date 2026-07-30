package com.hackhive.admin.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminRegistrationResponse {

    private Long registrationId;

    private Long hackathonId;

    private String hackathonName;

    private Long studentProfileId;

    private String studentName;

    private String studentEmail;

    private LocalDateTime registeredAt;
}