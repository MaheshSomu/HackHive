package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.AddExperienceRequest;
import com.hackhive.student.dto.request.UpdateExperienceRequest;
import com.hackhive.student.dto.response.ExperienceResponse;
import com.hackhive.student.service.StudentExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/experiences")
@RequiredArgsConstructor
public class StudentExperienceController {

    private final StudentExperienceService studentExperienceService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExperienceResponse>> addExperience(
            @Valid @RequestBody AddExperienceRequest request) {

        ExperienceResponse response =
                studentExperienceService.addExperience(request);

        return ResponseEntity.ok(
                ApiResponse.<ExperienceResponse>builder()
                        .success(true)
                        .message("Experience added successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> getMyExperiences() {

        List<ExperienceResponse> response =
                studentExperienceService.getMyExperiences();

        return ResponseEntity.ok(
                ApiResponse.<List<ExperienceResponse>>builder()
                        .success(true)
                        .message("Experiences fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExperienceResponse>> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExperienceRequest request) {

        ExperienceResponse response =
                studentExperienceService.updateExperience(id, request);

        return ResponseEntity.ok(
                ApiResponse.<ExperienceResponse>builder()
                        .success(true)
                        .message("Experience updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(
            @PathVariable Long id) {

        studentExperienceService.deleteExperience(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Experience deleted successfully.")
                        .build()
        );
    }
}