package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.response.ResumeResponse;
import com.hackhive.student.service.StudentResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student/resume")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentResumeController {

    private final StudentResumeService studentResumeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            @RequestParam("file") MultipartFile file) {

        ResumeResponse response =
                studentResumeService.uploadResume(file);

        return ResponseEntity.ok(
                ApiResponse.<ResumeResponse>builder()
                        .success(true)
                        .message("Resume uploaded successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ResumeResponse>> getMyResume() {

        ResumeResponse response =
                studentResumeService.getMyResume();

        return ResponseEntity.ok(
                ApiResponse.<ResumeResponse>builder()
                        .success(true)
                        .message("Resume fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadMyResume() {

        Resource resource =
                studentResumeService.downloadMyResumeResource();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"resume.pdf\"")
                .body(resource);
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteResume() {

        studentResumeService.deleteResume();

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Resume deleted successfully.")
                        .build()
        );
    }
}