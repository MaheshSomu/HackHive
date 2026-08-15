package com.hackhive.organizer.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.organizer.dto.request.CreateOrganizerProfileRequest;
import com.hackhive.organizer.dto.request.UpdateOrganizerProfileRequest;
import com.hackhive.organizer.dto.response.OrganizerProfileResponse;
import com.hackhive.organizer.service.OrganizerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/organizer/profile")
@RequiredArgsConstructor
public class OrganizerProfileController {

    private final OrganizerProfileService organizerProfileService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizerProfileResponse>> createProfile(
            @Valid @RequestBody CreateOrganizerProfileRequest request) {

        OrganizerProfileResponse response =
                organizerProfileService.createProfile(request);

        return ResponseEntity.ok(
                ApiResponse.<OrganizerProfileResponse>builder()
                        .success(true)
                        .message("Organizer profile created successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<OrganizerProfileResponse>> getMyProfile() {

        OrganizerProfileResponse response =
                organizerProfileService.getMyProfile();

        return ResponseEntity.ok(
                ApiResponse.<OrganizerProfileResponse>builder()
                        .success(true)
                        .message("Organizer profile fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<OrganizerProfileResponse>> updateProfile(
            @Valid @RequestBody UpdateOrganizerProfileRequest request) {

        OrganizerProfileResponse response =
                organizerProfileService.updateProfile(request);

        return ResponseEntity.ok(
                ApiResponse.<OrganizerProfileResponse>builder()
                        .success(true)
                        .message("Organizer profile updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @PostMapping(
            value = "/logo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<OrganizerProfileResponse>> uploadLogo(
            @RequestParam("file") MultipartFile file) {

        OrganizerProfileResponse response =
                organizerProfileService.uploadLogo(file);

        return ResponseEntity.ok(
                ApiResponse.<OrganizerProfileResponse>builder()
                        .success(true)
                        .message("Organizer logo uploaded successfully.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/logo")
    public ResponseEntity<ApiResponse<OrganizerProfileResponse>> removeLogo() {

        OrganizerProfileResponse response =
                organizerProfileService.removeLogo();

        return ResponseEntity.ok(
                ApiResponse.<OrganizerProfileResponse>builder()
                        .success(true)
                        .message("Organizer logo removed successfully.")
                        .data(response)
                        .build()
        );
    }
}