package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.CertificationResponse;
import com.hackhive.student.entity.StudentCertification;
import org.springframework.stereotype.Component;

@Component
public class StudentCertificationMapper {

    public CertificationResponse toResponse(
            StudentCertification certification) {

        return CertificationResponse.builder()
                .id(certification.getId())
                .name(certification.getName())
                .issuingOrganization(
                        certification.getIssuingOrganization())
                .issueDate(certification.getIssueDate())
                .expirationDate(certification.getExpirationDate())
                .credentialId(certification.getCredentialId())
                .credentialUrl(certification.getCredentialUrl())
                .build();
    }
}