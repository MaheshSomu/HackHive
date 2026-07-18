package com.hackhive.student.service;

import com.hackhive.student.dto.request.AddCertificationRequest;
import com.hackhive.student.dto.request.UpdateCertificationRequest;
import com.hackhive.student.dto.response.CertificationResponse;

import java.util.List;

public interface StudentCertificationService {

    CertificationResponse addCertification(
            AddCertificationRequest request
    );

    List<CertificationResponse> getMyCertifications();

    CertificationResponse updateCertification(
            Long id,
            UpdateCertificationRequest request
    );

    void deleteCertification(Long id);
}