package com.hackhive.auth.service.impl;

import com.hackhive.auth.dto.OAuthRegistrationData;
import com.hackhive.auth.dto.request.ForgotPasswordRequest;
import com.hackhive.auth.dto.request.LoginRequest;
import com.hackhive.auth.dto.request.OAuthCompleteRegistrationRequest;
import com.hackhive.auth.dto.request.RegisterRequest;
import com.hackhive.auth.dto.request.ResendVerificationRequest;
import com.hackhive.auth.dto.request.ResetPasswordRequest;
import com.hackhive.auth.dto.response.AuthResponse;
import com.hackhive.auth.dto.response.UserResponse;
import com.hackhive.auth.entity.Role;
import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.RoleRepository;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.auth.security.JwtService;
import com.hackhive.auth.service.AuthService;
import com.hackhive.auth.service.EmailService;
import com.hackhive.auth.service.OAuthRegistrationService;
import com.hackhive.common.enums.RoleType;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.EmailNotVerifiedException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.common.exception.UnauthorizedException;
import com.hackhive.common.util.TokenGenerator;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.organizer.repository.OrganizerProfileRepository;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hackhive.auth.enums.AuthProvider;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final OAuthRegistrationService oauthRegistrationService;
    private final OrganizerProfileRepository organizerProfileRepository;
    @Override
    public String register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "Email already registered."
            );
        }

        // Prevent users from registering themselves as ADMIN
        if (request.getRole() == RoleType.ADMIN) {
            throw new BadRequestException(
                    "Admin registration is not allowed."
            );
        }

        // Get the requested STUDENT or ORGANIZER role
        Role role = roleRepository
                .findByName(request.getRole())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found."
                        ));

        // Create user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phoneNumber(request.getPhoneNumber())
                .enabled(true)
                .emailVerified(false)
                .role(role)
                .authProvider(AuthProvider.LOCAL)
                .build();
        
        user.setEmailVerified(false);

        user.setEmailVerificationToken(
                TokenGenerator.generateVerificationToken());

        user.setEmailVerificationTokenExpiry(
                TokenGenerator.getVerificationTokenExpiry());
        
        User savedUser = userRepository.save(user);
        emailService.sendVerificationEmail(savedUser);

        // Automatically create StudentProfile
        // only when the registered user is a STUDENT
        if (request.getRole() == RoleType.STUDENT) {

        StudentProfile studentProfile =
                StudentProfile.builder()
                        .user(savedUser)
                        .build();

        studentProfileRepository.save(studentProfile);

        } else if (request.getRole() == RoleType.ORGANIZER) {

        OrganizerProfile organizerProfile =
                OrganizerProfile.builder()
                        .user(savedUser)
                        .verified(false)
                        .build();

        organizerProfileRepository.save(organizerProfile);
        }

        return "Registration successful.\r\n" + 
                "\r\n" + 
                "Please verify your email before logging in.";
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Invalid email or password."
                        ));

        if (!user.getEmailVerified()) {
            throw new EmailNotVerifiedException("Please verify your email before logging in.");
        }
        // Reject disabled accounts
        if (!Boolean.TRUE.equals(user.getEnabled())) {
        throw new UnauthorizedException(
                "Your account has been disabled."
        );
        }
        // Verify password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new UnauthorizedException(
                    "Invalid email or password."
            );
        }

        // Generate JWT token
        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        // Return authentication response
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(
                        user.getRole()
                                .getName()
                                .name()
                )
                .authProvider(user.getAuthProvider().name())
                .build();
    }

    @Override
    public UserResponse getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = userRepository
                .findByEmail(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));

        return UserResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(
                        user.getRole()
                                .getName()
                                .name()
                )
                .authProvider(user.getAuthProvider().name())
                .build();
    }

    @Override
    public void verifyEmail(String token) {

        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token."));

        if (user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification token has expired.");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);

        userRepository.save(user);
    }

    @Override
    public void resendVerificationEmail(
            ResendVerificationRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
                throw new RuntimeException(
                        "Email is already verified.");
        }

        user.setEmailVerificationToken(
                TokenGenerator.generateVerificationToken());

        user.setEmailVerificationTokenExpiry(
                TokenGenerator.getVerificationTokenExpiry());

        userRepository.save(user);

        emailService.sendVerificationEmail(user);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        user.setPasswordResetToken(
                TokenGenerator.generateVerificationToken());

        user.setPasswordResetTokenExpiry(
                LocalDateTime.now().plusMinutes(30));

        userRepository.save(user);

        emailService.sendPasswordResetEmail(user);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository
                .findByPasswordResetToken(request.getToken())
                .orElseThrow(() ->
                        new RuntimeException("Invalid password reset token."));

        if (user.getPasswordResetTokenExpiry()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Password reset token has expired.");
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException("Passwords do not match.");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);

        userRepository.save(user);
    }

    @Transactional
    @Override
    public AuthResponse completeOAuthRegistration(
        OAuthCompleteRegistrationRequest request) {

        OAuthRegistrationData registration =
                oauthRegistrationService.getRegistration(
                        request.getRegistrationId());

        if (registration == null) {
                throw new BadRequestException(
                        "Registration session expired.");
        }

        if (userRepository.findByEmail(
                registration.getEmail()).isPresent()) {

                throw new BadRequestException(
                        "User already exists.");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found."));

        User user = User.builder()
                .fullName(registration.getFullName())
                .email(registration.getEmail())
                .password(passwordEncoder.encode(
                        UUID.randomUUID().toString()))
                .enabled(true)
                .emailVerified(true)
                .role(role)
                .authProvider(AuthProvider.GOOGLE)
                .build();

        userRepository.save(user);
        if (role.getName() == RoleType.STUDENT) {

        StudentProfile studentProfile =
                StudentProfile.builder()
                        .user(user)
                        .build();

        studentProfileRepository.save(studentProfile);

        } else if (role.getName() == RoleType.ORGANIZER) {

        OrganizerProfile organizerProfile =
                OrganizerProfile.builder()
                        .user(user)
                        .build();

        organizerProfileRepository.save(organizerProfile);
        }
        oauthRegistrationService.removeRegistration(
                request.getRegistrationId());

        String token =
                jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().getName().name())
                .authProvider(user.getAuthProvider().name())
                .build();
    }

    @Override
    public void requestPasswordChange() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = userRepository
                .findByEmail(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));

        if (user.getAuthProvider() == AuthProvider.GOOGLE) {
            throw new BadRequestException(
                    "Password management is handled through your Google account."
            );
        }

        user.setPasswordResetToken(
                TokenGenerator.generateVerificationToken());

        user.setPasswordResetTokenExpiry(
                LocalDateTime.now().plusMinutes(30));

        userRepository.save(user);

        emailService.sendPasswordResetEmail(user);
    }
}