package com.hackhive.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class OAuthRegistrationData {

    private String email;

    private String fullName;

    private String picture;

    private LocalDateTime expiresAt;
}