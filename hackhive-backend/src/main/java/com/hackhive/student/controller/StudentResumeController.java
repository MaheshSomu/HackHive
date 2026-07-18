package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.response.ResumeResponse;
import com.hackhive.student.service.StudentResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student/resume")
@RequiredArgsConstructor
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