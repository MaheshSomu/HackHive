package com.hackhive.auth.controller;

import com.hackhive.auth.dto.request.ForgotPasswordRequest;
import com.hackhive.auth.dto.request.LoginRequest;
import com.hackhive.auth.dto.request.RegisterRequest;
import com.hackhive.auth.dto.request.ResendVerificationRequest;
import com.hackhive.auth.dto.request.ResetPasswordRequest;
import com.hackhive.auth.dto.response.AuthResponse;
import com.hackhive.auth.dto.response.UserResponse;
import com.hackhive.auth.entity.User;
import com.hackhive.auth.service.AuthService;
import com.hackhive.auth.service.EmailService;
import com.hackhive.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody RegisterRequest request) {

        String message = authService.register(request);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);

        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful.")
                .data(authResponse)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {

        UserResponse userResponse = authService.getCurrentUser();

        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User details fetched successfully.")
                .data(userResponse)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail() {

        User user = new User();

        user.setFullName("Mahesh");

        user.setEmail("somumahesh8886.ai@gmail.com");

        user.setEmailVerificationToken("123456789");

        emailService.sendVerificationEmail(user);

        return ResponseEntity.ok("Verification email sent successfully.");
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token) {

        authService.verifyEmail(token);

        return ResponseEntity.ok(
            "Email verified successfully.");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationEmail(
            @Valid @RequestBody ResendVerificationRequest request) {

        authService.resendVerificationEmail(request);

        return ResponseEntity.ok(
            "Verification email sent successfully.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request);

        return ResponseEntity.ok(
            "Password reset email sent successfully.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok("Password reset successfully.");
    }
}