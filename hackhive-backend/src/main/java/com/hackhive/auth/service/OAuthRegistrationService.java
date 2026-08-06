package com.hackhive.auth.service;

import com.hackhive.auth.dto.OAuthRegistrationData;

public interface OAuthRegistrationService {

    String createRegistration(
            String email,
            String fullName,
            String picture
    );

    OAuthRegistrationData getRegistration(
            String registrationId
    );

    void removeRegistration(
            String registrationId
    );
}