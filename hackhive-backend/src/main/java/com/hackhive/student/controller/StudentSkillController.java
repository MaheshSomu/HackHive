package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.AddSkillRequest;
import com.hackhive.student.dto.request.UpdateSkillRequest;
import com.hackhive.student.dto.response.SkillResponse;
import com.hackhive.student.service.StudentSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/skills")
@RequiredArgsConstructor
public class StudentSkillController {

    private final StudentSkillService studentSkillService;

    @PostMapping
    public ResponseEntity<ApiResponse<SkillResponse>> addSkill(
            @Valid @RequestBody AddSkillRequest request) {

        SkillResponse response = studentSkillService.addSkill(request);

        return ResponseEntity.ok(
                ApiResponse.<SkillResponse>builder()
                        .success(true)
                        .message("Skill added successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getMySkills() {

        List<SkillResponse> response = studentSkillService.getMySkills();

        return ResponseEntity.ok(
                ApiResponse.<List<SkillResponse>>builder()
                        .success(true)
                        .message("Skills fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillResponse>> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSkillRequest request) {

        SkillResponse response =
                studentSkillService.updateSkill(id, request);

        return ResponseEntity.ok(
                ApiResponse.<SkillResponse>builder()
                        .success(true)
                        .message("Skill updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(
            @PathVariable Long id) {

        studentSkillService.deleteSkill(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Skill deleted successfully.")
                        .build()
        );
    }
}