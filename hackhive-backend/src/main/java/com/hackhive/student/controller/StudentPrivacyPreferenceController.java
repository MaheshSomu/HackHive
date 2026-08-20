package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.UpdateStudentPrivacyPreferenceRequest;
import com.hackhive.student.dto.response.StudentPrivacyPreferenceResponse;
import com.hackhive.student.service.StudentPrivacyPreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/privacy-preferences")
@RequiredArgsConstructor
public class StudentPrivacyPreferenceController {

    private final StudentPrivacyPreferenceService preferenceService;

    @GetMapping
    public ResponseEntity<ApiResponse<StudentPrivacyPreferenceResponse>> getPreferences() {
        StudentPrivacyPreferenceResponse response = preferenceService.getPreferences();

        return ResponseEntity.ok(
                ApiResponse.<StudentPrivacyPreferenceResponse>builder()
                        .success(true)
                        .message("Privacy preferences fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<StudentPrivacyPreferenceResponse>> updatePreferences(
            @Valid @RequestBody UpdateStudentPrivacyPreferenceRequest request) {

        StudentPrivacyPreferenceResponse response = preferenceService.updatePreferences(request);

        return ResponseEntity.ok(
                ApiResponse.<StudentPrivacyPreferenceResponse>builder()
                        .success(true)
                        .message("Privacy preferences updated successfully.")
                        .data(response)
                        .build()
        );
    }
}
