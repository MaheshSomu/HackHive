package com.hackhive.auth.service.impl;

import com.hackhive.auth.dto.OAuthRegistrationData;
import com.hackhive.auth.service.OAuthRegistrationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OAuthRegistrationServiceImpl
        implements OAuthRegistrationService {

    private final Map<String, OAuthRegistrationData> registrations =
            new ConcurrentHashMap<>();

    @Override
    public String createRegistration(
            String email,
            String fullName,
            String picture
    ) {

        String registrationId =
                UUID.randomUUID().toString();

        registrations.put(
                registrationId,
                new OAuthRegistrationData(
                        email,
                        fullName,
                        picture,
                        LocalDateTime.now().plusMinutes(5)
                )
        );

        return registrationId;
    }

    @Override
    public OAuthRegistrationData getRegistration(
            String registrationId
    ) {

        OAuthRegistrationData data =
                registrations.get(registrationId);

        if (data == null) {
            return null;
        }

        if (data.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            registrations.remove(registrationId);

            return null;
        }

        return data;
    }

    @Override
    public void removeRegistration(
            String registrationId
    ) {

        registrations.remove(registrationId);

    }
}