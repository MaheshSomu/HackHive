package com.hackhive.common.util;

import java.time.LocalDateTime;
import java.util.UUID;

public class TokenGenerator {

    private TokenGenerator() {
    }

    public static String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }

    public static LocalDateTime getVerificationTokenExpiry() {
        return LocalDateTime.now().plusHours(24);
    }

    public static String generatePasswordResetToken() {
        return UUID.randomUUID().toString();
    }

    public static LocalDateTime getPasswordResetExpiry() {
        return LocalDateTime.now().plusMinutes(30);
    }

}