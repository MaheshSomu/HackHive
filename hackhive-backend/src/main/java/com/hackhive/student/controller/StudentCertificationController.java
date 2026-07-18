package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.AddCertificationRequest;
import com.hackhive.student.dto.request.UpdateCertificationRequest;
import com.hackhive.student.dto.response.CertificationResponse;
import com.hackhive.student.service.StudentCertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/certifications")
@RequiredArgsConstructor
public class StudentCertificationController {

    private final StudentCertificationService studentCertificationService;

    @PostMapping
    public ResponseEntity<ApiResponse<CertificationResponse>> addCertification(
            @Valid @RequestBody AddCertificationRequest request) {

        CertificationResponse response =
                studentCertificationService.addCertification(request);

        return ResponseEntity.ok(
                ApiResponse.<CertificationResponse>builder()
                        .success(true)
                        .message("Certification added successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getMyCertifications() {

        List<CertificationResponse> response =
                studentCertificationService.getMyCertifications();

        return ResponseEntity.ok(
                ApiResponse.<List<CertificationResponse>>builder()
                        .success(true)
                        .message("Certifications fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificationResponse>> updateCertification(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCertificationRequest request) {

        CertificationResponse response =
                studentCertificationService.updateCertification(
                        id, request);

        return ResponseEntity.ok(
                ApiResponse.<CertificationResponse>builder()
                        .success(true)
                        .message("Certification updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(
            @PathVariable Long id) {

        studentCertificationService.deleteCertification(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Certification deleted successfully.")
                        .build()
        );
    }
}