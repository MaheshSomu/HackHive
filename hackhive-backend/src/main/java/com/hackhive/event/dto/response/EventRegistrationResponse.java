package com.hackhive.event.dto.response;

import com.hackhive.event.enums.PaymentStatus;
import com.hackhive.event.enums.RegistrationStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class EventRegistrationResponse {

    private Long registrationId;

    private Long eventId;

    private String eventTitle;

    private Long studentProfileId;

    private String studentName;

    private String studentEmail;

    private RegistrationStatus status;

    private PaymentStatus paymentStatus;

    private BigDecimal amountPaid;

    private String razorpayOrderId;

    private LocalDateTime paidAt;

    private String phoneNumber;

    private Integer participantCount;

    private java.util.List<EventRegistrationMemberResponse> members;
}