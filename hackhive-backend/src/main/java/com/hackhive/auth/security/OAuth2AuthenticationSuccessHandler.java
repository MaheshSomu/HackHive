package com.hackhive.auth.security;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.auth.service.OAuthRegistrationService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final OAuthRegistrationService oauthRegistrationService;
    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {

            String jwt = jwtService.generateToken(user.getEmail());

            response.sendRedirect(
                    frontendUrl + "/oauth-success?token=" + jwt
            );

            return;
        }

        String registrationId =
        oauthRegistrationService.createRegistration(
                email,
                oauthUser.getAttribute("name"),
                oauthUser.getAttribute("picture")
        );

        response.sendRedirect(
                frontendUrl +
                "/oauth-complete-registration?registrationId=" +
                registrationId
        );
    }
}