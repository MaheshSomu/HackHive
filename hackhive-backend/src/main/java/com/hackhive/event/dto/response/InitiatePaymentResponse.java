package com.hackhive.event.dto.response;

import com.hackhive.event.enums.RegistrationType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class InitiatePaymentResponse {

    private Long registrationId;

    private Long eventId;

    private String eventTitle;

    private RegistrationType registrationType;

    private boolean isFree;

    private String razorpayOrderId;

    private Long amount; // in paise for Razorpay JS SDK (e.g. 50000 for ₹500)

    private String currency; // "INR"

    private String keyId; // Razorpay public Key ID

    private String studentName;

    private String studentEmail;

    private String message;
}
