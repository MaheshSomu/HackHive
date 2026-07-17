package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.AddEducationRequest;
import com.hackhive.student.dto.request.UpdateEducationRequest;
import com.hackhive.student.dto.response.EducationResponse;
import com.hackhive.student.service.StudentEducationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/education")
@RequiredArgsConstructor
public class StudentEducationController {

    private final StudentEducationService studentEducationService;

    @PostMapping
    public ResponseEntity<ApiResponse<EducationResponse>> addEducation(
            @Valid @RequestBody AddEducationRequest request) {

        EducationResponse response =
                studentEducationService.addEducation(request);

        return ResponseEntity.ok(
                ApiResponse.<EducationResponse>builder()
                        .success(true)
                        .message("Education added successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EducationResponse>>> getMyEducations() {

        List<EducationResponse> response =
                studentEducationService.getEducations();

        return ResponseEntity.ok(
                ApiResponse.<List<EducationResponse>>builder()
                        .success(true)
                        .message("Education fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EducationResponse>> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEducationRequest request) {

        EducationResponse response =
                studentEducationService.updateEducation(id, request);

        return ResponseEntity.ok(
                ApiResponse.<EducationResponse>builder()
                        .success(true)
                        .message("Education updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
            @PathVariable Long id) {

        studentEducationService.deleteEducation(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Education deleted successfully.")
                        .build()
        );
    }
}