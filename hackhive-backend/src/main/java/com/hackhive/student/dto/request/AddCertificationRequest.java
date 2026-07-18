package com.hackhive.student.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AddCertificationRequest {

    @NotBlank(message = "Certification name is required")
    private String name;

    @NotBlank(message = "Issuing organization is required")
    private String issuingOrganization;

    private LocalDate issueDate;

    private LocalDate expirationDate;

    private String credentialId;

    private String credentialUrl;
}