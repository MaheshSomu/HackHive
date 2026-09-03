package com.hackhive.auth.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.service.EmailService;
import com.hackhive.auth.util.EmailTemplateBuilder;
import com.hackhive.auth.util.EmailTemplateBuilder.KeyValueRow;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

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

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Verify Your HackHive Account");

            String greeting = "Hello " + (user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : "there") + ",";
            String content = "Welcome to HackHive! 🎉 Thank you for registering. Please verify your email address by clicking the button below to activate your account.";
            String noteText = "This verification link will expire in 24 hours. If you did not create this account, please ignore this email.";

            String htmlContent = EmailTemplateBuilder.buildEmailHtml(
                    "Account Verification",
                    "Verify your email address",
                    greeting,
                    content,
                    null,
                    "Verify Email Address",
                    verificationLink,
                    noteText
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
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

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Reset Your HackHive Password");

            String greeting = "Hello " + (user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : "there") + ",";
            String content = "We received a request to reset your HackHive account password. Click the button below to choose a new password.";
            String noteText = "This link will expire in 30 minutes. If you didn't request a password reset, you can safely ignore this email.";

            String htmlContent = EmailTemplateBuilder.buildEmailHtml(
                    "Account Security",
                    "Reset your password",
                    greeting,
                    content,
                    null,
                    "Reset Password",
                    resetLink,
                    noteText
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
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

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Reactivate Your HackHive Account");

            String greeting = "Hello " + (user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : "there") + ",";
            String content = "We received a request to reactivate your HackHive account. Click the button below to complete account reactivation and gain full access.";
            String noteText = "This link will expire in 30 minutes. If you didn't request account reactivation, you can safely ignore this email.";

            String htmlContent = EmailTemplateBuilder.buildEmailHtml(
                    "Account Recovery",
                    "Your HackHive account is active again",
                    greeting,
                    content,
                    null,
                    "Go to HackHive",
                    reactivationLink,
                    noteText
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
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
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("New Registration — " + eventTitle);

            String greeting = "Hello " + (organizerName != null && !organizerName.isBlank() ? organizerName : "Organizer") + ",";
            String content = "A new participant has registered for your event <strong>" + escapeHtml(eventTitle) + "</strong>! 🎉";

            List<KeyValueRow> details = List.of(
                    new KeyValueRow("Event", eventTitle != null ? eventTitle : "N/A"),
                    new KeyValueRow("Participant Name", studentName != null ? studentName : "Student"),
                    new KeyValueRow("Participant Email", studentEmail != null ? studentEmail : "N/A")
            );

            String htmlContent = EmailTemplateBuilder.buildEmailHtml(
                    "Event Organizer",
                    "New Participant Registration",
                    greeting,
                    content,
                    details,
                    null,
                    null,
                    "You are receiving this email as the organizer of " + (eventTitle != null ? eventTitle : "this event") + "."
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
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
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("Payment Receipt & Registration Confirmation — " + eventTitle);

            String greeting = "Hello " + (studentName != null && !studentName.isBlank() ? studentName : "Participant") + ",";
            String content = "Thank you for your payment! Your registration for <strong>" + escapeHtml(eventTitle) + "</strong> is confirmed. 🎉";

            String statusStr = paymentStatus != null ? paymentStatus : "PAID";
            String statusBadgeHtml = "<span style=\"display:inline-block; padding:3px 8px; border-radius:4px; font-size:12px; font-weight:700; background-color:#dcfce7; color:#166534; letter-spacing:0.3px;\">"
                    + escapeHtml(statusStr) + "</span>";

            List<KeyValueRow> details = List.of(
                    new KeyValueRow("Event", eventTitle != null ? eventTitle : "N/A"),
                    new KeyValueRow("Registration ID", registrationId != null ? String.valueOf(registrationId) : "N/A"),
                    new KeyValueRow("Amount Paid", "₹" + (amountPaid != null ? amountPaid : "0.00")),
                    new KeyValueRow("Payment Status", statusBadgeHtml, true),
                    new KeyValueRow("Razorpay Order ID", razorpayOrderId != null ? razorpayOrderId : "N/A"),
                    new KeyValueRow("Razorpay Payment ID", razorpayPaymentId != null ? razorpayPaymentId : "N/A"),
                    new KeyValueRow("Date Paid", paidAt != null ? paidAt : "N/A")
            );

            String htmlContent = EmailTemplateBuilder.buildEmailHtml(
                    "Receipt",
                    "Payment Successful",
                    greeting,
                    content,
                    details,
                    null,
                    null,
                    "Keep this email as an official receipt for your event registration."
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            System.err.println(
                    "Failed to send student payment receipt email to " + recipientEmail + ": " + e.getMessage());
        }
    }

    private static String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}