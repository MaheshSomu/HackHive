package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.AddCertificationRequest;
import com.hackhive.student.dto.request.UpdateCertificationRequest;
import com.hackhive.student.dto.response.CertificationResponse;
import com.hackhive.student.entity.StudentCertification;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.mapper.StudentCertificationMapper;
import com.hackhive.student.repository.StudentCertificationRepository;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.service.StudentCertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentCertificationServiceImpl
        implements StudentCertificationService {

    private final StudentCertificationRepository studentCertificationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentCertificationMapper studentCertificationMapper;

    private StudentProfile getCurrentStudentProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        return studentProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found."));
    }

    @Override
    public CertificationResponse addCertification(
            AddCertificationRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentCertification certification =
                StudentCertification.builder()
                        .studentProfile(profile)
                        .name(request.getName())
                        .issuingOrganization(
                                request.getIssuingOrganization())
                        .issueDate(request.getIssueDate())
                        .expirationDate(request.getExpirationDate())
                        .credentialId(request.getCredentialId())
                        .credentialUrl(request.getCredentialUrl())
                        .build();

        certification =
                studentCertificationRepository.save(certification);

        return studentCertificationMapper.toResponse(certification);
    }

    @Override
    public List<CertificationResponse> getMyCertifications() {

        StudentProfile profile = getCurrentStudentProfile();

        return studentCertificationRepository
                .findByStudentProfile(profile)
                .stream()
                .map(studentCertificationMapper::toResponse)
                .toList();
    }

    @Override
    public CertificationResponse updateCertification(
            Long id,
            UpdateCertificationRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentCertification certification =
                studentCertificationRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Certification not found."));

        certification.setName(request.getName());
        certification.setIssuingOrganization(
                request.getIssuingOrganization());
        certification.setIssueDate(request.getIssueDate());
        certification.setExpirationDate(
                request.getExpirationDate());
        certification.setCredentialId(request.getCredentialId());
        certification.setCredentialUrl(request.getCredentialUrl());

        certification =
                studentCertificationRepository.save(certification);

        return studentCertificationMapper.toResponse(certification);
    }

    @Override
    public void deleteCertification(Long id) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentCertification certification =
                studentCertificationRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Certification not found."));

        studentCertificationRepository.delete(certification);
    }
}