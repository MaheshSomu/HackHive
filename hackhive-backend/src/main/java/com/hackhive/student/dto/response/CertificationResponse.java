package com.hackhive.student.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class CertificationResponse {

    private Long id;

    private String name;

    private String issuingOrganization;

    private LocalDate issueDate;

    private LocalDate expirationDate;

    private String credentialId;

    private String credentialUrl;
}