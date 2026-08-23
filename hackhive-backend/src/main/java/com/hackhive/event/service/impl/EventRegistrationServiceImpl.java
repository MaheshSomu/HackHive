package com.hackhive.event.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.auth.service.EmailService;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.event.dto.request.InitiateRegistrationRequest;
import com.hackhive.event.dto.request.EventRegistrationMemberRequest;
import com.hackhive.event.dto.request.VerifyPaymentRequest;
import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.InitiatePaymentResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;
import com.hackhive.event.entity.Event;
import com.hackhive.event.entity.EventRegistration;
import com.hackhive.event.entity.EventRegistrationMember;
import com.hackhive.event.enums.PaymentStatus;
import com.hackhive.event.enums.RegistrationStatus;
import com.hackhive.event.enums.RegistrationType;
import com.hackhive.event.mapper.EventRegistrationMapper;
import com.hackhive.event.repository.EventRegistrationRepository;
import com.hackhive.event.repository.EventRepository;
import com.hackhive.event.service.EventRegistrationService;
import com.hackhive.organizer.entity.OrganizerNotificationPreference;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerNotificationPreferenceRepository;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.repository.TeamMemberRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventRegistrationServiceImpl
        implements EventRegistrationService {

    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRepository eventRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final UserRepository userRepository;
    private final EventRegistrationMapper eventRegistrationMapper;
    private final TeamMemberRepository teamMemberRepository;
    private final OrganizerNotificationPreferenceRepository preferenceRepository;
    private final EmailService emailService;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key-id:rzp_test_placeholder}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:rzp_secret_placeholder}")
    private String razorpayKeySecret;

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."));
    }

    private StudentProfile getCurrentStudentProfile() {

        User user = getCurrentUser();

        return studentProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found."));
    }

    private OrganizerProfile getCurrentOrganizerProfile() {

        User user = getCurrentUser();

        return organizerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Organizer profile not found."));
    }

    @Override
    @Transactional
    public EventRegistrationResponse registerForEvent(Long eventId) {
        return registerForEvent(eventId, null);
    }

    @Override
    @Transactional
    public EventRegistrationResponse registerForEvent(Long eventId, InitiateRegistrationRequest request) {
        InitiatePaymentResponse initiateResponse = initiateRegistration(eventId, request);
        if (initiateResponse.isFree()) {
            EventRegistration reg = eventRegistrationRepository.findById(initiateResponse.getRegistrationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event registration not found."));
            return eventRegistrationMapper.toResponse(reg);
        } else {
            throw new BadRequestException("This event requires payment. Please use the payment initiation flow.");
        }
    }

    @Override
    @Transactional
    public InitiatePaymentResponse initiateRegistration(Long eventId) {
        return initiateRegistration(eventId, null);
    }

    @Override
    @Transactional
    public InitiatePaymentResponse initiateRegistration(Long eventId, InitiateRegistrationRequest request) {
        StudentProfile studentProfile = getCurrentStudentProfile();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));

        LocalDateTime now = LocalDateTime.now();
        if (event.getRegistrationStartDate() != null && now.isBefore(event.getRegistrationStartDate())) {
            throw new BadRequestException("Event registration has not started yet.");
        }
        if (now.isAfter(event.getRegistrationEndDate())) {
            throw new BadRequestException("Event registration has already closed.");
        }

        // Validate Participant Count & Team Rules
        int count = 1;
        if (request != null && request.getParticipantCount() != null && request.getParticipantCount() > 0) {
            count = request.getParticipantCount();
        }

        if (event.getMaxTeamSize() != null && event.getMaxTeamSize() > 1) {
            if (count > event.getMaxTeamSize()) {
                throw new BadRequestException("Participant count exceeds the event maximum team size of " + event.getMaxTeamSize() + ".");
            }
        } else {
            if (count > 1) {
                throw new BadRequestException("This event only allows individual registrations.");
            }
        }

        // Validate Additional Members if count > 1
        if (count > 1 && request != null) {
            List<EventRegistrationMemberRequest> addMembers = request.getMembers();
            if (addMembers == null || addMembers.size() < (count - 1)) {
                throw new BadRequestException("Please provide details for all " + (count - 1) + " additional team members.");
            }
            for (int i = 0; i < count - 1; i++) {
                EventRegistrationMemberRequest m = addMembers.get(i);
                if (m == null || m.getFullName() == null || m.getFullName().isBlank() || m.getEmail() == null || m.getEmail().isBlank()) {
                    throw new BadRequestException("Name and Email are required for additional member #" + (i + 1) + ".");
                }
            }
        }

        Optional<EventRegistration> existingOpt = eventRegistrationRepository
                .findByEventAndStudentProfile(event, studentProfile);

        // Capacity check
        if (event.getMaxParticipants() != null && event.getMaxParticipants() > 0) {
            boolean isExistingActive = existingOpt.isPresent()
                    && (existingOpt.get().getStatus() == RegistrationStatus.CONFIRMED || existingOpt.get().getStatus() == RegistrationStatus.PENDING_PAYMENT);

            if (!isExistingActive) {
                long activeConfirmedCount = eventRegistrationRepository.countByEventAndStatus(event, RegistrationStatus.CONFIRMED);
                if (activeConfirmedCount >= event.getMaxParticipants()) {
                    throw new BadRequestException("Event registration capacity has been reached.");
                }
            }
        }

        EventRegistration registration;
        if (existingOpt.isPresent()) {
            registration = existingOpt.get();
            if (registration.getStatus() == RegistrationStatus.CONFIRMED) {
                throw new BadRequestException("You are already registered for this event.");
            }
            if (registration.getStatus() == RegistrationStatus.CANCELLED) {
                registration.setRazorpayOrderId(null);
                registration.setRazorpayPaymentId(null);
            }
        } else {
            registration = EventRegistration.builder()
                    .event(event)
                    .studentProfile(studentProfile)
                    .build();
        }

        // Save Registration Form Fields
        String phone = (request != null && request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank())
                ? request.getPhoneNumber()
                : null;
        registration.setPhoneNumber(phone);
        registration.setParticipantCount(count);

        // Clear existing member list if re-initiating
        if (registration.getMembers() != null) {
            registration.getMembers().clear();
        } else {
            registration.setMembers(new java.util.ArrayList<>());
        }

        // Primary Participant Member
        String primaryName = (request != null && request.getFullName() != null && !request.getFullName().isBlank())
                ? request.getFullName()
                : (studentProfile.getUser() != null ? studentProfile.getUser().getFullName() : "Student");
        String primaryEmail = (request != null && request.getEmail() != null && !request.getEmail().isBlank())
                ? request.getEmail()
                : (studentProfile.getUser() != null ? studentProfile.getUser().getEmail() : "");
        String primaryCollege = (request != null && request.getCollege() != null && !request.getCollege().isBlank())
                ? request.getCollege()
                : studentProfile.getCollege();
        String primaryBranch = (request != null && request.getBranch() != null && !request.getBranch().isBlank())
                ? request.getBranch()
                : studentProfile.getBranch();
        String primaryGradYear = (request != null && request.getGraduationYear() != null && !request.getGraduationYear().isBlank())
                ? request.getGraduationYear()
                : studentProfile.getGraduationYear();

        EventRegistrationMember primaryMember = EventRegistrationMember.builder()
                .eventRegistration(registration)
                .fullName(primaryName)
                .email(primaryEmail)
                .college(primaryCollege)
                .branch(primaryBranch)
                .graduationYear(primaryGradYear)
                .isPrimary(true)
                .memberIndex(0)
                .studentProfile(studentProfile)
                .isHackHiveMember(true)
                .build();
        registration.getMembers().add(primaryMember);

        // Additional Team Members
        if (count > 1 && request != null && request.getMembers() != null) {
            for (int i = 0; i < count - 1; i++) {
                EventRegistrationMemberRequest mReq = request.getMembers().get(i);
                
                // Perform backend email verification to detect existing HackHive account
                String memberEmail = mReq.getEmail() != null ? mReq.getEmail().trim() : "";
                StudentProfile foundProfile = null;
                boolean isMember = false;
                if (!memberEmail.isBlank()) {
                    Optional<User> uOpt = userRepository.findByEmail(memberEmail);
                    if (uOpt.isPresent()) {
                        Optional<StudentProfile> spOpt = studentProfileRepository.findByUser(uOpt.get());
                        if (spOpt.isPresent()) {
                            foundProfile = spOpt.get();
                            isMember = true;
                        }
                    }
                }

                EventRegistrationMember addMember = EventRegistrationMember.builder()
                        .eventRegistration(registration)
                        .fullName(mReq.getFullName())
                        .email(mReq.getEmail())
                        .college(mReq.getCollege() != null ? mReq.getCollege() : primaryCollege)
                        .branch(mReq.getBranch() != null ? mReq.getBranch() : "")
                        .graduationYear(mReq.getGraduationYear() != null ? mReq.getGraduationYear() : "")
                        .isPrimary(false)
                        .memberIndex(i + 1)
                        .studentProfile(foundProfile)
                        .isHackHiveMember(isMember)
                        .build();
                registration.getMembers().add(addMember);
            }
        }

        // Handle FREE Event
        if (event.getRegistrationType() == null || event.getRegistrationType() == RegistrationType.FREE) {
            registration.setStatus(RegistrationStatus.CONFIRMED);
            registration.setPaymentStatus(PaymentStatus.NOT_APPLICABLE);
            registration.setAmountPaid(BigDecimal.ZERO);
            registration = eventRegistrationRepository.save(registration);

            notifyOrganizerOfRegistration(event, studentProfile);

            return InitiatePaymentResponse.builder()
                    .registrationId(registration.getId())
                    .eventId(event.getId())
                    .eventTitle(event.getTitle())
                    .registrationType(RegistrationType.FREE)
                    .isFree(true)
                    .message("Free event registration successful.")
                    .build();
        }

        // Handle PAID Event
        registration.setStatus(RegistrationStatus.PENDING_PAYMENT);
        registration.setPaymentStatus(PaymentStatus.PENDING);

        BigDecimal fee = event.getRegistrationFee() != null ? event.getRegistrationFee() : BigDecimal.ZERO;
        registration.setAmountPaid(fee); // Snapshot initiation fee for financial audit consistency

        long amountInPaise = fee.multiply(new BigDecimal("100")).longValue();

        String razorpayOrderId = registration.getRazorpayOrderId();

        // Create new Razorpay order if missing or empty
        if (razorpayOrderId == null || razorpayOrderId.isBlank()) {
            if (razorpayClient != null) {
                try {
                    JSONObject orderRequest = new JSONObject();
                    orderRequest.put("amount", amountInPaise);
                    orderRequest.put("currency", "INR");
                    orderRequest.put("receipt", "reg_" + event.getId() + "_" + studentProfile.getId());

                    Order order = razorpayClient.orders.create(orderRequest);
                    razorpayOrderId = order.get("id");
                } catch (Exception e) {
                    System.err.println("Failed to create Razorpay order via SDK: " + e.getMessage());
                    razorpayOrderId = "order_dev_" + System.currentTimeMillis();
                }
            } else {
                razorpayOrderId = "order_dev_" + System.currentTimeMillis();
            }
            registration.setRazorpayOrderId(razorpayOrderId);
        }

        registration = eventRegistrationRepository.save(registration);

        String studentName = studentProfile.getUser() != null ? studentProfile.getUser().getFullName() : "Student";
        String studentEmail = studentProfile.getUser() != null ? studentProfile.getUser().getEmail() : "";

        return InitiatePaymentResponse.builder()
                .registrationId(registration.getId())
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .registrationType(RegistrationType.PAID)
                .isFree(false)
                .razorpayOrderId(razorpayOrderId)
                .amount(amountInPaise)
                .currency("INR")
                .keyId(razorpayKeyId)
                .studentName(studentName)
                .studentEmail(studentEmail)
                .message("Payment initiated successfully.")
                .build();
    }

    @Override
    @Transactional
    public EventRegistrationResponse verifyPayment(VerifyPaymentRequest request) {
        StudentProfile currentStudent = getCurrentStudentProfile();

        EventRegistration registration = eventRegistrationRepository
                .findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Event registration not found for the specified order ID."));

        // Verify Student Ownership
        if (!registration.getStudentProfile().getId().equals(currentStudent.getId())) {
            throw new BadRequestException("Payment order does not belong to the authenticated student.");
        }

        // Verify Event is PAID
        Event event = registration.getEvent();
        if (event.getRegistrationType() != RegistrationType.PAID) {
            throw new BadRequestException("Payment verification is only applicable for PAID events.");
        }

        // Prevent processing payment for CANCELLED registrations
        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("Cannot complete payment for a cancelled registration. Please initiate a new registration.");
        }

        // Idempotency: If already confirmed, return early
        if (registration.getStatus() == RegistrationStatus.CONFIRMED
                && registration.getPaymentStatus() == PaymentStatus.PAID) {
            return eventRegistrationMapper.toResponse(registration);
        }

        // Verify Razorpay payment ID is not attached to another registration
        Optional<EventRegistration> existingPaymentRegOpt = eventRegistrationRepository.findByRazorpayPaymentId(request.getRazorpayPaymentId());
        if (existingPaymentRegOpt.isPresent() && !existingPaymentRegOpt.get().getId().equals(registration.getId())) {
            throw new BadRequestException("Razorpay Payment ID has already been processed for another registration.");
        }

        // HMAC-SHA256 Signature Verification
        String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        String expectedSignature = calculateHmacSha256(payload, razorpayKeySecret);

        if (!expectedSignature.equals(request.getRazorpaySignature())) {
            throw new BadRequestException("Invalid payment signature.");
        }

        // Signature is valid -> Confirm Registration
        BigDecimal snapshottedAmount = registration.getAmountPaid() != null ? registration.getAmountPaid() : event.getRegistrationFee();

        registration.setStatus(RegistrationStatus.CONFIRMED);
        registration.setPaymentStatus(PaymentStatus.PAID);
        registration.setAmountPaid(snapshottedAmount);
        registration.setRazorpayPaymentId(request.getRazorpayPaymentId());
        registration.setPaidAt(LocalDateTime.now());

        registration = eventRegistrationRepository.save(registration);

        notifyOrganizerOfRegistration(event, currentStudent);
        sendStudentReceiptEmail(registration, currentStudent, event);

        return eventRegistrationMapper.toResponse(registration);
    }

    private void sendStudentReceiptEmail(EventRegistration registration, StudentProfile studentProfile, Event event) {
        try {
            if (studentProfile != null && studentProfile.getUser() != null) {
                String studentEmail = studentProfile.getUser().getEmail();
                String studentName = studentProfile.getUser().getFullName();
                if (studentEmail != null && !studentEmail.isBlank()) {
                    emailService.sendPaymentReceiptEmail(
                            studentEmail,
                            studentName,
                            event.getTitle(),
                            registration.getId(),
                            registration.getRazorpayOrderId(),
                            registration.getRazorpayPaymentId(),
                            registration.getAmountPaid() != null ? registration.getAmountPaid().toString() : "0.00",
                            registration.getPaymentStatus() != null ? registration.getPaymentStatus().name() : "PAID",
                            registration.getPaidAt() != null ? registration.getPaidAt().toString() : LocalDateTime.now().toString()
                    );
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to trigger student payment receipt email: " + e.getMessage());
        }
    }

    private void notifyOrganizerOfRegistration(Event event, StudentProfile studentProfile) {
        try {
            OrganizerProfile organizerProfile = event.getOrganizerProfile();
            if (organizerProfile != null) {
                boolean sendEmail = preferenceRepository.findByOrganizerProfile(organizerProfile)
                        .map(OrganizerNotificationPreference::getRegistrations)
                        .orElse(true);

                if (sendEmail) {
                    String recipientEmail = organizerProfile.getContactEmail();
                    if (recipientEmail == null || recipientEmail.isBlank()) {
                        if (organizerProfile.getUser() != null) {
                            recipientEmail = organizerProfile.getUser().getEmail();
                        }
                    }
                    if (recipientEmail != null && !recipientEmail.isBlank()) {
                        String organizerName = organizerProfile.getOrganizationName();
                        String eventTitle = event.getTitle();
                        String studentName = studentProfile.getUser() != null ? studentProfile.getUser().getFullName() : "Student";
                        String studentEmail = studentProfile.getUser() != null ? studentProfile.getUser().getEmail() : "N/A";
                        emailService.sendNewRegistrationEmail(recipientEmail, organizerName, eventTitle, studentName, studentEmail);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to trigger registration email notification: " + e.getMessage());
        }
    }

    private String calculateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error calculating HMAC SHA256 signature", e);
        }
    }

    @Override
    public List<EventRegistrationResponse> getMyRegistrations() {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        return eventRegistrationRepository
                .findByStudentProfile(studentProfile)
                .stream()
                .map(eventRegistrationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void cancelRegistration(Long eventId) {

        StudentProfile studentProfile =
                getCurrentStudentProfile();

        Event event = eventRepository
                .findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));
        boolean belongsToEventTeam =
                teamMemberRepository
                        .existsByStudentProfileAndTeam_Event(
                                studentProfile,
                                event
                        );

        if (belongsToEventTeam) {
            throw new BadRequestException(
                    "You cannot cancel event registration while you are a member of a team for this event."
            );
        }
        EventRegistration registration =
                eventRegistrationRepository
                        .findByEventAndStudentProfile(
                                event,
                                studentProfile
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Event registration not found."));

        if (event.getRegistrationType() == RegistrationType.PAID && registration.getStatus() == RegistrationStatus.CONFIRMED) {
            registration.setStatus(RegistrationStatus.CANCELLED);
            eventRegistrationRepository.save(registration);
        } else {
            eventRegistrationRepository.delete(registration);
        }
    }

    @Override
    public List<RegisteredStudentResponse> getEventRegistrations(
            Long eventId) {

        OrganizerProfile organizerProfile =
                getCurrentOrganizerProfile();

        Event event = eventRepository
                .findByIdAndOrganizerProfile(
                        eventId,
                        organizerProfile
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found."));

        return eventRegistrationRepository
                .findByEvent(event)
                .stream()
                .map(eventRegistrationMapper
                        ::toRegisteredStudentResponse)
                .toList();
    }
}