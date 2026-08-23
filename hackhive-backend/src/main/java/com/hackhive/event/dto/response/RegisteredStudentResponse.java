package com.hackhive.event.dto.response;

import com.hackhive.event.enums.PaymentStatus;
import com.hackhive.event.enums.RegistrationStatus;
import com.hackhive.event.enums.RegistrationType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class RegisteredStudentResponse {

    private Long registrationId;

    private Long studentProfileId;

    private String fullName;

    private String email;

    private String college;

    private String branch;

    private String graduationYear;

    private RegistrationStatus registrationStatus;

    private PaymentStatus paymentStatus;

    private RegistrationType registrationType;

    private BigDecimal amountPaid;

    private LocalDateTime paidAt;

    private String phoneNumber;

    private Integer participantCount;

    private java.util.List<EventRegistrationMemberResponse> members;
}