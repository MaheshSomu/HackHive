package com.hackhive.admin.service.impl;

import com.hackhive.admin.dto.response.*;
import com.hackhive.admin.service.AdminService;
import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.enums.RoleType;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.entity.Event;
import com.hackhive.event.entity.EventRegistration;
import com.hackhive.event.repository.EventRegistrationRepository;
import com.hackhive.event.repository.EventRepository;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.entity.Team;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    // =========================================================
    // Dashboard
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStatistics() {

        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalStudents(studentProfileRepository.count())
                .totalOrganizers(organizerProfileRepository.count())
                .totalHackathons(eventRepository.count())
                .totalTeams(teamRepository.count())
                .totalRegistrations(eventRegistrationRepository.count())
                .build();
    }

    // =========================================================
    // User Management
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapUser)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(Long userId) {

        User user = getUser(userId);

        return mapUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getUsersByRole(
            String role) {

        RoleType roleType;

        try {
            roleType = RoleType.valueOf(
                    role.trim().toUpperCase()
            );
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException(
                    "Invalid role. Allowed values: "
                            + "STUDENT, ORGANIZER, ADMIN."
            );
        }

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() != null
                                && user.getRole().getName()
                                == roleType
                )
                .map(this::mapUser)
                .toList();
    }

    @Override
    @Transactional
    public AdminUserResponse enableUser(
            Long userId) {

        User user = getUser(userId);

        user.setEnabled(true);

        user = userRepository.save(user);

        return mapUser(user);
    }

    @Override
    @Transactional
    public AdminUserResponse disableUser(
            Long userId) {

        User user = getUser(userId);

        user.setEnabled(false);

        user = userRepository.save(user);

        return mapUser(user);
    }

    // =========================================================
    // Organizer Management
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<AdminOrganizerResponse> getAllOrganizers() {

        return organizerProfileRepository.findAll()
                .stream()
                .map(this::mapOrganizer)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminOrganizerResponse getOrganizerById(
            Long organizerProfileId) {

        OrganizerProfile organizer =
                organizerProfileRepository
                        .findById(organizerProfileId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Organizer profile not found."
                                ));

        return mapOrganizer(organizer);
    }

    @Override
    @Transactional
    public AdminOrganizerResponse verifyOrganizer(
            Long organizerProfileId) {

        OrganizerProfile organizer =
                organizerProfileRepository
                        .findById(organizerProfileId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Organizer profile not found."
                                ));

        organizer.setVerified(true);
        organizer = organizerProfileRepository.save(organizer);

        return mapOrganizer(organizer);
    }

    @Override
    @Transactional
    public AdminOrganizerResponse unverifyOrganizer(
            Long organizerProfileId) {

        OrganizerProfile organizer =
                organizerProfileRepository
                        .findById(organizerProfileId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Organizer profile not found."
                                ));

        organizer.setVerified(false);
        organizer = organizerProfileRepository.save(organizer);

        return mapOrganizer(organizer);
    }

    // =========================================================
    // Hackathon / Event Management
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<AdminHackathonResponse> getAllHackathons() {

        return eventRepository.findAll()
                .stream()
                .map(this::mapHackathon)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminHackathonResponse getHackathonById(
            Long hackathonId) {

        Event event =
                eventRepository
                        .findById(hackathonId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Hackathon not found."
                                ));

        return mapHackathon(event);
    }

    @Override
        @Transactional
        public void deleteHackathon(Long hackathonId) {

        Event event = eventRepository
                .findById(hackathonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hackathon not found."
                        ));

        boolean hasRegistrations =
                eventRegistrationRepository
                        .existsByEvent(event);

        boolean hasTeams =
                teamRepository
                        .existsByEvent(event);

        if (hasRegistrations || hasTeams) {
                throw new BadRequestException(
                        "Cannot delete hackathon because it has existing teams or registrations."
                );
        }

        eventRepository.delete(event);
        }

    // =========================================================
    // Team Oversight
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<AdminTeamResponse> getAllTeams() {

        return teamRepository.findAll()
                .stream()
                .map(this::mapTeam)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminTeamResponse getTeamById(
            Long teamId) {

        Team team =
                teamRepository
                        .findById(teamId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Team not found."
                                ));

        return mapTeam(team);
    }

    // =========================================================
    // Registration Oversight
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<AdminRegistrationResponse> getAllRegistrations() {

        return eventRegistrationRepository
                .findAll()
                .stream()
                .map(this::mapRegistration)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminRegistrationResponse getRegistrationById(
            Long registrationId) {

        EventRegistration registration =
                eventRegistrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Event registration not found."
                                ));

        return mapRegistration(registration);
    }

    // =========================================================
    // Helper Methods
    // =========================================================

    private User getUser(Long userId) {

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));
    }

    private AdminUserResponse mapUser(
            User user) {

        return AdminUserResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(
                        user.getRole() != null
                                ? user.getRole()
                                    .getName()
                                    .name()
                                : null
                )
                .enabled(user.getEnabled())
                .emailVerified(user.getEmailVerified())
                .build();
    }

    private AdminOrganizerResponse mapOrganizer(
            OrganizerProfile organizer) {

        User user = organizer.getUser();

        return AdminOrganizerResponse.builder()
                .organizerProfileId(
                        organizer.getId()
                )
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .organizationName(
                        organizer.getOrganizationName()
                )
                .organizationType(
                        organizer.getOrganizationType()
                )
                .description(
                        organizer.getDescription()
                )
                .websiteUrl(
                        organizer.getWebsiteUrl()
                )
                .contactEmail(
                        organizer.getContactEmail()
                )
                .contactPhone(
                        organizer.getContactPhone()
                )
                .logoUrl(
                        organizer.getLogoUrl()
                )
                .location(
                        organizer.getLocation()
                )
                .verified(
                        organizer.getVerified()
                )
                .enabled(user.getEnabled())
                .build();
    }

    private AdminHackathonResponse mapHackathon(
            Event event) {

        OrganizerProfile organizer =
                event.getOrganizerProfile();

        return AdminHackathonResponse.builder()
                .hackathonId(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .organizerProfileId(
                        organizer.getId()
                )
                .organizerName(
                        organizer.getUser()
                                .getFullName()
                )
                .organizationName(
                        organizer.getOrganizationName()
                )
                .location(event.getLocation())
                .mode(event.getEventMode())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .registrationStartDate(
                        event.getRegistrationStartDate()
                )
                .registrationDeadline(
                        event.getRegistrationEndDate()
                )
                .minTeamSize(
                        event.getMinTeamSize()
                )
                .maxTeamSize(
                        event.getMaxTeamSize()
                )
                .eligibility(
                        event.getEligibility()
                )
                .bannerUrl(
                        event.getBannerUrl()
                )
                .collegeName(
                        event.getCollegeName()
                )
                .build();
    }

    private AdminTeamResponse mapTeam(
            Team team) {

        long memberCount =
                teamMemberRepository
                        .countByTeam(team);

        return AdminTeamResponse.builder()
                .teamId(team.getId())
                .teamName(team.getName())
                .hackathonId(
                        team.getEvent().getId()
                )
                .hackathonName(
                        team.getEvent().getTitle()
                )
                .leaderStudentProfileId(
                        team.getLeader().getId()
                )
                .leaderName(
                        team.getLeader()
                                .getUser()
                                .getFullName()
                )
                .currentMembers(
                        Math.toIntExact(memberCount)
                )
                .maxMembers(
                        team.getMaxMembers()
                )
                .build();
    }

    private AdminRegistrationResponse mapRegistration(
            EventRegistration registration) {

        return AdminRegistrationResponse.builder()
                .registrationId(
                        registration.getId()
                )
                .hackathonId(
                        registration.getEvent()
                                .getId()
                )
                .hackathonName(
                        registration.getEvent()
                                .getTitle()
                )
                .studentProfileId(
                        registration.getStudentProfile()
                                .getId()
                )
                .studentName(
                        registration.getStudentProfile()
                                .getUser()
                                .getFullName()
                )
                .studentEmail(
                        registration.getStudentProfile()
                                .getUser()
                                .getEmail()
                )
                .registeredAt(
                        registration.getCreatedAt()
                )
                .build();
    }
}