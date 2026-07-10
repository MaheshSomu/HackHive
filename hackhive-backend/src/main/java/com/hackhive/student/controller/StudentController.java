package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.UpdateStudentProfileRequest;
import com.hackhive.student.dto.response.StudentProfileResponse;
import com.hackhive.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getMyProfile() {

        StudentProfileResponse response = studentService.getMyProfile();

        return ResponseEntity.ok(
                ApiResponse.<StudentProfileResponse>builder()
                        .success(true)
                        .message("Profile fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateMyProfile(
            @Valid @RequestBody UpdateStudentProfileRequest request) {

        StudentProfileResponse response =
                studentService.updateMyProfile(request);

        return ResponseEntity.ok(
                ApiResponse.<StudentProfileResponse>builder()
                        .success(true)
                        .message("Profile updated successfully.")
                        .data(response)
                        .build()
        );
    }
}