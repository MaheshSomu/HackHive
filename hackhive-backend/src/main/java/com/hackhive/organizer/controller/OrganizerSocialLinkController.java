package com.hackhive.organizer.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.organizer.dto.request.OrganizerSocialLinkRequest;
import com.hackhive.organizer.dto.response.OrganizerSocialLinkResponse;
import com.hackhive.organizer.enums.SocialPlatform;
import com.hackhive.organizer.service.OrganizerSocialLinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer/social-links")
@RequiredArgsConstructor
public class OrganizerSocialLinkController {

    private final OrganizerSocialLinkService organizerSocialLinkService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrganizerSocialLinkResponse>>> getMySocialLinks() {
        List<OrganizerSocialLinkResponse> response = organizerSocialLinkService.getMySocialLinks();

        return ResponseEntity.ok(
                ApiResponse.<List<OrganizerSocialLinkResponse>>builder()
                        .success(true)
                        .message("Social links fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizerSocialLinkResponse>> saveSocialLink(
            @Valid @RequestBody OrganizerSocialLinkRequest request) {

        OrganizerSocialLinkResponse response = organizerSocialLinkService.saveSocialLink(request);

        return ResponseEntity.ok(
                ApiResponse.<OrganizerSocialLinkResponse>builder()
                        .success(true)
                        .message("Social link saved successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSocialLink(@PathVariable Long id) {
        organizerSocialLinkService.deleteSocialLink(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Social link deleted successfully.")
                        .data(null)
                        .build()
        );
    }

    @DeleteMapping("/platform/{platform}")
    public ResponseEntity<ApiResponse<Void>> deleteSocialLinkByPlatform(@PathVariable SocialPlatform platform) {
        organizerSocialLinkService.deleteSocialLinkByPlatform(platform);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Social link deleted successfully.")
                        .data(null)
                        .build()
        );
    }
}
