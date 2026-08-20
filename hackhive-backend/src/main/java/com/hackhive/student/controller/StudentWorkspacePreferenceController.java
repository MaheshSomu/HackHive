package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.UpdateStudentWorkspacePreferenceRequest;
import com.hackhive.student.dto.response.StudentWorkspacePreferenceResponse;
import com.hackhive.student.service.StudentWorkspacePreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/workspace-preferences")
@RequiredArgsConstructor
public class StudentWorkspacePreferenceController {

    private final StudentWorkspacePreferenceService preferenceService;

    @GetMapping
    public ResponseEntity<ApiResponse<StudentWorkspacePreferenceResponse>> getPreferences() {
        StudentWorkspacePreferenceResponse response = preferenceService.getPreferences();

        return ResponseEntity.ok(
                ApiResponse.<StudentWorkspacePreferenceResponse>builder()
                        .success(true)
                        .message("Workspace preferences fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<StudentWorkspacePreferenceResponse>> updatePreferences(
            @Valid @RequestBody UpdateStudentWorkspacePreferenceRequest request) {

        StudentWorkspacePreferenceResponse response = preferenceService.updatePreferences(request);

        return ResponseEntity.ok(
                ApiResponse.<StudentWorkspacePreferenceResponse>builder()
                        .success(true)
                        .message("Workspace preferences updated successfully.")
                        .data(response)
                        .build()
        );
    }
}
