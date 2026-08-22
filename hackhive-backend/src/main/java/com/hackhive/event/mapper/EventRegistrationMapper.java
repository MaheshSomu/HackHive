package com.hackhive.event.mapper;

import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;
import com.hackhive.event.entity.EventRegistration;
import com.hackhive.event.enums.PaymentStatus;
import com.hackhive.event.enums.RegistrationStatus;
import org.springframework.stereotype.Component;

@Component
public class EventRegistrationMapper {

    public EventRegistrationResponse toResponse(
            EventRegistration registration) {

        RegistrationStatus status = registration.getStatus() != null
                ? registration.getStatus()
                : RegistrationStatus.CONFIRMED;

        PaymentStatus paymentStatus = registration.getPaymentStatus() != null
                ? registration.getPaymentStatus()
                : PaymentStatus.NOT_APPLICABLE;

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

        return RegisteredStudentResponse.builder()
                .registrationId(registration.getId())
                .studentProfileId(
                        registration.getStudentProfile().getId())
                .fullName(
                        registration.getStudentProfile()
                                .getUser()
                                .getFullName())
                .email(
                        registration.getStudentProfile()
                                .getUser()
                                .getEmail())
                .college(
                        registration.getStudentProfile()
                                .getCollege())
                .branch(
                        registration.getStudentProfile()
                                .getBranch())
                .graduationYear(
                        registration.getStudentProfile()
                                .getGraduationYear())
                .registrationStatus(status)
                .paymentStatus(paymentStatus)
                .registrationType(registrationType)
                .amountPaid(registration.getAmountPaid())
                .paidAt(registration.getPaidAt())
                .build();
    }
}