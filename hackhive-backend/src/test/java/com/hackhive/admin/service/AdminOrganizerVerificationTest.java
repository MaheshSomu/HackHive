package com.hackhive.admin.service;

import com.hackhive.admin.dto.response.AdminOrganizerResponse;
import com.hackhive.admin.service.impl.AdminServiceImpl;
import com.hackhive.auth.entity.Role;
import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.enums.RoleType;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.repository.EventRegistrationRepository;
import com.hackhive.event.repository.EventRepository;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminOrganizerVerificationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizerProfileRepository organizerProfileRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private EventRegistrationRepository eventRegistrationRepository;

    @Mock
    private TeamMemberRepository teamMemberRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    private OrganizerProfile sampleOrganizer;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .fullName("John Organizer")
                .email("organizer@example.com")
                .phoneNumber("1234567890")
                .role(Role.builder().name(RoleType.ORGANIZER).build())
                .enabled(true)
                .emailVerified(true)
                .build();
        sampleUser.setId(100L);

        sampleOrganizer = OrganizerProfile.builder()
                .user(sampleUser)
                .organizationName("Tech Innovators")
                .organizationType("University")
                .description("Student Tech Community")
                .location("New York, USA")
                .verified(false)
                .build();
        sampleOrganizer.setId(1L);
    }

    @Test
    @DisplayName("Admin can verify an unverified organizer profile")
    void testVerifyOrganizerSuccess() {
        when(organizerProfileRepository.findById(1L)).thenReturn(Optional.of(sampleOrganizer));
        when(organizerProfileRepository.save(any(OrganizerProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminOrganizerResponse response = adminService.verifyOrganizer(1L);

        assertNotNull(response);
        assertTrue(response.getVerified(), "Organizer verified status should be true");
        assertEquals("Tech Innovators", response.getOrganizationName());
        assertEquals("John Organizer", response.getFullName());
        assertTrue(response.isEnabled(), "User enabled status must remain unchanged");

        verify(organizerProfileRepository).save(sampleOrganizer);
        assertTrue(sampleOrganizer.getVerified());
    }

    @Test
    @DisplayName("Admin can revoke verification of a verified organizer profile")
    void testUnverifyOrganizerSuccess() {
        sampleOrganizer.setVerified(true);
        when(organizerProfileRepository.findById(1L)).thenReturn(Optional.of(sampleOrganizer));
        when(organizerProfileRepository.save(any(OrganizerProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminOrganizerResponse response = adminService.unverifyOrganizer(1L);

        assertNotNull(response);
        assertFalse(response.getVerified(), "Organizer verified status should be false");
        assertEquals("Tech Innovators", response.getOrganizationName());
        assertTrue(response.isEnabled());

        verify(organizerProfileRepository).save(sampleOrganizer);
        assertFalse(sampleOrganizer.getVerified());
    }

    @Test
    @DisplayName("Verifying an unknown organizer profile throws ResourceNotFoundException")
    void testVerifyUnknownOrganizerThrowsNotFound() {
        when(organizerProfileRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminService.verifyOrganizer(999L));
        verify(organizerProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("Unverifying an unknown organizer profile throws ResourceNotFoundException")
    void testUnverifyUnknownOrganizerThrowsNotFound() {
        when(organizerProfileRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminService.unverifyOrganizer(999L));
        verify(organizerProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("Verifying an already verified organizer is idempotent and preserves user and profile data")
    void testVerifyAlreadyVerifiedIdempotent() {
        sampleOrganizer.setVerified(true);
        when(organizerProfileRepository.findById(1L)).thenReturn(Optional.of(sampleOrganizer));
        when(organizerProfileRepository.save(any(OrganizerProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminOrganizerResponse response = adminService.verifyOrganizer(1L);

        assertTrue(response.getVerified());
        assertEquals("Tech Innovators", response.getOrganizationName());
        assertEquals("organizer@example.com", response.getEmail());
        assertTrue(sampleUser.getEmailVerified(), "Email verification must not be affected");
    }

    @Test
    @DisplayName("Unverifying an already unverified organizer is idempotent")
    void testUnverifyAlreadyUnverifiedIdempotent() {
        sampleOrganizer.setVerified(false);
        when(organizerProfileRepository.findById(1L)).thenReturn(Optional.of(sampleOrganizer));
        when(organizerProfileRepository.save(any(OrganizerProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminOrganizerResponse response = adminService.unverifyOrganizer(1L);

        assertFalse(response.getVerified());
        assertEquals("Tech Innovators", response.getOrganizationName());
    }
}
