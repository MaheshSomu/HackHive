package com.hackhive.auth.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    @Override
    public void sendVerificationEmail(User user) {

        String verificationLink =
                backendUrl + "/api/auth/verify-email?token="
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
                verificationLink
        ));

        mailSender.send(message);
    }

    @Override
public void sendPasswordResetEmail(User user) {

    String resetLink =
            frontendUrl + "/reset-password?token="
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
            resetLink
    ));

    mailSender.send(message);
}
}