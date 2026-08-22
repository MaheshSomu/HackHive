package com.hackhive.auth.service;

import com.hackhive.auth.entity.User;

public interface EmailService {

    void sendVerificationEmail(User user);

    void sendPasswordResetEmail(User user);

    void sendAccountReactivationEmail(User user);

    void sendNewRegistrationEmail(
            String recipientEmail,
            String organizerName,
            String eventTitle,
            String studentName,
            String studentEmail
    );

    void sendPaymentReceiptEmail(
            String recipientEmail,
            String studentName,
            String eventTitle,
            Long registrationId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String amountPaid,
            String paymentStatus,
            String paidAt
    );
}
