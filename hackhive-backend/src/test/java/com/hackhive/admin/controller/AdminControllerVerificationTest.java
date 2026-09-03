package com.hackhive.admin.controller;

import com.hackhive.admin.dto.response.AdminOrganizerResponse;
import com.hackhive.admin.service.AdminService;
import com.hackhive.common.response.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerVerificationTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private AdminOrganizerResponse verifiedResponse;
    private AdminOrganizerResponse unverifiedResponse;

    @BeforeEach
    void setUp() {
        verifiedResponse = AdminOrganizerResponse.builder()
                .organizerProfileId(1L)
                .organizationName("HackHive Community")
                .verified(true)
                .enabled(true)
                .build();

        unverifiedResponse = AdminOrganizerResponse.builder()
                .organizerProfileId(1L)
                .organizationName("HackHive Community")
                .verified(false)
                .enabled(true)
                .build();
    }

    @Test
    @DisplayName("PATCH /api/admin/organizers/{id}/verify calls service and returns verified response")
    void testVerifyOrganizerEndpoint() {
        when(adminService.verifyOrganizer(1L)).thenReturn(verifiedResponse);

        ResponseEntity<ApiResponse<AdminOrganizerResponse>> response = adminController.verifyOrganizer(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Organizer verified successfully.", response.getBody().getMessage());
        assertTrue(response.getBody().getData().getVerified());

        verify(adminService).verifyOrganizer(1L);
    }

    @Test
    @DisplayName("PATCH /api/admin/organizers/{id}/unverify calls service and returns unverified response")
    void testUnverifyOrganizerEndpoint() {
        when(adminService.unverifyOrganizer(1L)).thenReturn(unverifiedResponse);

        ResponseEntity<ApiResponse<AdminOrganizerResponse>> response = adminController.unverifyOrganizer(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Organizer verification revoked.", response.getBody().getMessage());
        assertFalse(response.getBody().getData().getVerified());

        verify(adminService).unverifyOrganizer(1L);
    }
}
