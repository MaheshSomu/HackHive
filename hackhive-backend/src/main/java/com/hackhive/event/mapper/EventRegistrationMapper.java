package com.hackhive.event.mapper;

import com.hackhive.event.dto.response.EventRegistrationMemberResponse;
import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;
import com.hackhive.event.entity.EventRegistration;
import com.hackhive.event.entity.EventRegistrationMember;
import com.hackhive.event.enums.PaymentStatus;
import com.hackhive.event.enums.RegistrationStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EventRegistrationMapper {

    private EventRegistrationMemberResponse toMemberResponse(EventRegistrationMember member) {
        if (member == null) return null;
        Long profileId = member.getStudentProfile() != null ? member.getStudentProfile().getId() : null;
        return EventRegistrationMemberResponse.builder()
                .id(member.getId())
                .fullName(member.getFullName())
                .email(member.getEmail())
                .college(member.getCollege())
                .branch(member.getBranch())
                .graduationYear(member.getGraduationYear())
                .isPrimary(member.getIsPrimary())
                .memberIndex(member.getMemberIndex())
                .studentProfileId(profileId)
                .isHackHiveMember(member.getIsHackHiveMember() != null ? member.getIsHackHiveMember() : (profileId != null))
                .build();
    }

    public EventRegistrationResponse toResponse(
            EventRegistration registration) {

        RegistrationStatus status = registration.getStatus() != null
                ? registration.getStatus()
                : RegistrationStatus.CONFIRMED;

        PaymentStatus paymentStatus = registration.getPaymentStatus() != null
                ? registration.getPaymentStatus()
                : PaymentStatus.NOT_APPLICABLE;

        List<EventRegistrationMemberResponse> memberResponses = registration.getMembers() != null
                ? registration.getMembers().stream().map(this::toMemberResponse).toList()
                : List.of();

        return EventRegistrationResponse.builder()
                .registrationId(registration.getId())
                .eventId(registration.getEvent().getId())
                .eventTitle(registration.getEvent().getTitle())
                .studentProfileId(
                        registration.getStudentProfile().getId())
                .studentName(
                        registration.getStudentProfile()
                                .getUser()
                                .getFullName())
                .studentEmail(
                        registration.getStudentProfile()
                                .getUser()
                                .getEmail())
                .status(status)
                .paymentStatus(paymentStatus)
                .amountPaid(registration.getAmountPaid())
                .razorpayOrderId(registration.getRazorpayOrderId())
                .paidAt(registration.getPaidAt())
                .phoneNumber(registration.getPhoneNumber())
                .participantCount(registration.getParticipantCount() != null ? registration.getParticipantCount() : 1)
                .members(memberResponses)
                .build();
    }

    public RegisteredStudentResponse toRegisteredStudentResponse(
            EventRegistration registration) {

        RegistrationStatus status = registration.getStatus() != null
                ? registration.getStatus()
                : RegistrationStatus.CONFIRMED;

        PaymentStatus paymentStatus = registration.getPaymentStatus() != null
                ? registration.getPaymentStatus()
                : PaymentStatus.NOT_APPLICABLE;

        com.hackhive.event.enums.RegistrationType registrationType =
                (registration.getEvent() != null && registration.getEvent().getRegistrationType() != null)
                        ? registration.getEvent().getRegistrationType()
                        : com.hackhive.event.enums.RegistrationType.FREE;

        List<EventRegistrationMemberResponse> memberResponses = registration.getMembers() != null
                ? registration.getMembers().stream().map(this::toMemberResponse).toList()
                : List.of();

        // Primary participant fallback if custom form name wasn't submitted
        String fullName = registration.getStudentProfile().getUser().getFullName();
        String email = registration.getStudentProfile().getUser().getEmail();
        String college = registration.getStudentProfile().getCollege();
        String branch = registration.getStudentProfile().getBranch();
        String gradYear = registration.getStudentProfile().getGraduationYear();

        if (registration.getMembers() != null && !registration.getMembers().isEmpty()) {
            EventRegistrationMember primary = registration.getMembers().stream()
                    .filter(m -> Boolean.TRUE.equals(m.getIsPrimary()))
                    .findFirst()
                    .orElse(registration.getMembers().get(0));
            if (primary != null) {
                if (primary.getFullName() != null && !primary.getFullName().isBlank()) fullName = primary.getFullName();
                if (primary.getEmail() != null && !primary.getEmail().isBlank()) email = primary.getEmail();
                if (primary.getCollege() != null && !primary.getCollege().isBlank()) college = primary.getCollege();
                if (primary.getBranch() != null && !primary.getBranch().isBlank()) branch = primary.getBranch();
                if (primary.getGraduationYear() != null && !primary.getGraduationYear().isBlank()) gradYear = primary.getGraduationYear();
            }
        }

        return RegisteredStudentResponse.builder()
                .registrationId(registration.getId())
                .studentProfileId(
                        registration.getStudentProfile().getId())
                .fullName(fullName)
                .email(email)
                .college(college)
                .branch(branch)
                .graduationYear(gradYear)
                .registrationStatus(status)
                .paymentStatus(paymentStatus)
                .registrationType(registrationType)
                .amountPaid(registration.getAmountPaid())
                .razorpayOrderId(registration.getRazorpayOrderId())
                .razorpayPaymentId(registration.getRazorpayPaymentId())
                .paidAt(registration.getPaidAt())
                .phoneNumber(registration.getPhoneNumber())
                .participantCount(registration.getParticipantCount() != null ? registration.getParticipantCount() : 1)
                .members(memberResponses)
                .build();
    }
}