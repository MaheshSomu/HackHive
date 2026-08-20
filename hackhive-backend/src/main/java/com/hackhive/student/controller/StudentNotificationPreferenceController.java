package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.UpdateStudentNotificationPreferenceRequest;
import com.hackhive.student.dto.response.StudentNotificationPreferenceResponse;
import com.hackhive.student.service.StudentNotificationPreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/notification-preferences")
@RequiredArgsConstructor
public class StudentNotificationPreferenceController {

    private final StudentNotificationPreferenceService preferenceService;

    @GetMapping
    public ResponseEntity<ApiResponse<StudentNotificationPreferenceResponse>> getPreferences() {
        StudentNotificationPreferenceResponse response = preferenceService.getPreferences();

        return ResponseEntity.ok(
                ApiResponse.<StudentNotificationPreferenceResponse>builder()
                        .success(true)
                        .message("Notification preferences fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<StudentNotificationPreferenceResponse>> updatePreferences(
            @Valid @RequestBody UpdateStudentNotificationPreferenceRequest request) {

        StudentNotificationPreferenceResponse response = preferenceService.updatePreferences(request);

        return ResponseEntity.ok(
                ApiResponse.<StudentNotificationPreferenceResponse>builder()
                        .success(true)
                        .message("Notification preferences updated successfully.")
                        .data(response)
                        .build()
        );
    }
}
