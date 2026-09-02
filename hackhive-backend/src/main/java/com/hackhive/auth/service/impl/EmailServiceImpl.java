package com.hackhive.auth.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${backend.url}")
    private String backendUrl;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Async
    @Override
    public void sendVerificationEmail(User user) {
        try {
            String verificationLink = backendUrl + "/api/auth/verify-email?token="
                    + user.getEmailVerificationToken();

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Verify Your HackHive Account");

            message.setText("""
                    Hello %s,

                    Welcome to HackHive! 🎉

                    Thank you for registering.

                    Please verify your email by clicking the link below:

                    %s

                    This verification link will expire in 24 hours.

                    If you did not create this account, please ignore this email.

                    Regards,
                    HackHive Team
                    """.formatted(
                    user.getFullName(),
                    verificationLink));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send verification email to " + user.getEmail() + ": " + e.getMessage());
        }
    }

    @Async
    @Override
    public void sendPasswordResetEmail(User user) {
        try {
            String resetLink = frontendUrl + "/reset-password?token="
                    + user.getPasswordResetToken();

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Reset Your HackHive Password");

            message.setText("""
                    Hello %s,

                    We received a request to reset your HackHive password.

                    Click the link below to reset your password:

                    %s

                    This link will expire in 30 minutes.

                    If you didn't request this password reset,
                    you can safely ignore this email.

                    Regards,
                    HackHive Team
                    """.formatted(
                    user.getFullName(),
                    resetLink));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to " + user.getEmail() + ": " + e.getMessage());
        }
    }

    @Async
    @Override
    public void sendAccountReactivationEmail(User user) {
        try {
            String reactivationLink = frontendUrl + "/reactivate-account?token="
                    + user.getAccountReactivationToken();

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Reactivate Your HackHive Account");

            message.setText("""
                    Hello %s,

                    We received a request to reactivate your HackHive account.

                    Click the link below to reactivate your account:

                    %s

                    This link will expire in 30 minutes.

                    If you didn't request account reactivation,
                    you can safely ignore this email.

                    Regards,
                    HackHive Team
                    """.formatted(
                    user.getFullName(),
                    reactivationLink));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send account reactivation email to " + user.getEmail() + ": " + e.getMessage());
        }
    }

    @Async
    @Override
    public void sendNewRegistrationEmail(
            String recipientEmail,
            String organizerName,
            String eventTitle,
            String studentName,
            String studentEmail) {

        if (recipientEmail == null || recipientEmail.isBlank()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("New Registration — " + eventTitle);
            message.setText("""
                    Hello %s,

                    A new participant has registered for your event "%s"! 🎉

                    Participant Details:
                    - Name: %s
                    - Email: %s

                    Regards,
                    HackHive Team
                    """.formatted(
                    organizerName != null && !organizerName.isBlank() ? organizerName : "Organizer",
                    eventTitle,
                    studentName != null ? studentName : "Student",
                    studentEmail != null ? studentEmail : "N/A"));
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println(
                    "Failed to send registration notification email to " + recipientEmail + ": " + e.getMessage());
        }
    }

    @Async
    @Override
    public void sendPaymentReceiptEmail(
            String recipientEmail,
            String studentName,
            String eventTitle,
            Long registrationId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String amountPaid,
            String paymentStatus,
            String paidAt) {

        if (recipientEmail == null || recipientEmail.isBlank()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("Payment Receipt & Registration Confirmation — " + eventTitle);
            message.setText("""
                    Hello %s,

                    Thank you for your payment! Your registration for "%s" is confirmed. 🎉

                    Transaction Receipt Details:
                    - Event: %s
                    - Registration ID: %s
                    - Amount Paid: ₹%s
                    - Payment Status: %s
                    - Razorpay Order ID: %s
                    - Razorpay Payment ID: %s
                    - Paid Date: %s

                    Regards,
                    HackHive Team
                    """.formatted(
                    studentName != null ? studentName : "Participant",
                    eventTitle,
                    eventTitle,
                    registrationId != null ? registrationId : "N/A",
                    amountPaid != null ? amountPaid : "0.00",
                    paymentStatus != null ? paymentStatus : "PAID",
                    razorpayOrderId != null ? razorpayOrderId : "N/A",
                    razorpayPaymentId != null ? razorpayPaymentId : "N/A",
                    paidAt != null ? paidAt : "N/A"));
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println(
                    "Failed to send student payment receipt email to " + recipientEmail + ": " + e.getMessage());
        }
    }
}