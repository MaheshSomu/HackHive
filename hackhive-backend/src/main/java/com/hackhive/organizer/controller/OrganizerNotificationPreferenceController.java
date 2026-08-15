package com.hackhive.organizer.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.organizer.dto.request.UpdateOrganizerNotificationPreferenceRequest;
import com.hackhive.organizer.dto.response.OrganizerNotificationPreferenceResponse;
import com.hackhive.organizer.service.OrganizerNotificationPreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizer/notification-preferences")
@RequiredArgsConstructor
public class OrganizerNotificationPreferenceController {

    private final OrganizerNotificationPreferenceService preferenceService;

    @GetMapping
    public ResponseEntity<ApiResponse<OrganizerNotificationPreferenceResponse>> getPreferences() {
        OrganizerNotificationPreferenceResponse response = preferenceService.getPreferences();

        return ResponseEntity.ok(
                ApiResponse.<OrganizerNotificationPreferenceResponse>builder()
                        .success(true)
                        .message("Notification preferences fetched successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<OrganizerNotificationPreferenceResponse>> updatePreferences(
            @Valid @RequestBody UpdateOrganizerNotificationPreferenceRequest request) {

        OrganizerNotificationPreferenceResponse response = preferenceService.updatePreferences(request);

        return ResponseEntity.ok(
                ApiResponse.<OrganizerNotificationPreferenceResponse>builder()
                        .success(true)
                        .message("Notification preferences updated successfully.")
                        .data(response)
                        .build()
        );
    }
}
