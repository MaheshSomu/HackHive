package com.hackhive.student.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.student.dto.request.AddSocialLinkRequest;
import com.hackhive.student.dto.request.UpdateSocialLinkRequest;
import com.hackhive.student.dto.response.SocialLinkResponse;
import com.hackhive.student.service.StudentSocialLinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/social-links")
@RequiredArgsConstructor
public class StudentSocialLinkController {

    private final StudentSocialLinkService studentSocialLinkService;

    @PostMapping
    public ResponseEntity<ApiResponse<SocialLinkResponse>> addSocialLink(
            @Valid @RequestBody AddSocialLinkRequest request) {

        SocialLinkResponse response =
                studentSocialLinkService.addSocialLink(request);

        return ResponseEntity.ok(
                ApiResponse.<SocialLinkResponse>builder()
                        .success(true)
                        .message("Social link added successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SocialLinkResponse>>> getMySocialLinks() {

        List<SocialLinkResponse> response =
                studentSocialLinkService.getMySocialLinks();

        return ResponseEntity.ok(
                ApiResponse.<List<SocialLinkResponse>>builder()
                        .success(true)
                        .message("Social links fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SocialLinkResponse>> updateSocialLink(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSocialLinkRequest request) {

        SocialLinkResponse response =
                studentSocialLinkService.updateSocialLink(id, request);

        return ResponseEntity.ok(
                ApiResponse.<SocialLinkResponse>builder()
                        .success(true)
                        .message("Social link updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSocialLink(
            @PathVariable Long id) {

        studentSocialLinkService.deleteSocialLink(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Social link deleted successfully.")
                        .build()
        );
    }
}