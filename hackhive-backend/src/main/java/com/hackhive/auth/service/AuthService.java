package com.hackhive.auth.service;

import com.hackhive.auth.dto.request.ForgotPasswordRequest;
import com.hackhive.auth.dto.request.LoginRequest;
import com.hackhive.auth.dto.request.OAuthCompleteRegistrationRequest;
import com.hackhive.auth.dto.request.RegisterRequest;
import com.hackhive.auth.dto.request.ResendVerificationRequest;
import com.hackhive.auth.dto.request.ResetPasswordRequest;
import com.hackhive.auth.dto.response.AuthResponse;
import com.hackhive.auth.dto.response.UserResponse;

public interface AuthService {

    String register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser();

    void verifyEmail(String token);

    void resendVerificationEmail(ResendVerificationRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    AuthResponse completeOAuthRegistration(OAuthCompleteRegistrationRequest request);

    void requestPasswordChange();

    void requestAccountReactivation(ForgotPasswordRequest request);

    void reactivateAccount(String token);
}