package com.hackhive.auth.service.impl;

import com.hackhive.auth.dto.request.LoginRequest;
import com.hackhive.auth.dto.request.RegisterRequest;
import com.hackhive.auth.dto.response.AuthResponse;
import com.hackhive.auth.dto.response.UserResponse;
import com.hackhive.auth.entity.Role;
import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.RoleRepository;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.auth.security.JwtService;
import com.hackhive.auth.service.AuthService;
import com.hackhive.common.enums.RoleType;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.common.exception.UnauthorizedException;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

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
                .build();

        User savedUser = userRepository.save(user);

        // Automatically create StudentProfile
        // only when the registered user is a STUDENT
        if (request.getRole() == RoleType.STUDENT) {

            StudentProfile studentProfile =
                    StudentProfile.builder()
                            .user(savedUser)
                            .build();

            studentProfileRepository.save(
                    studentProfile
            );
        }

        return "Registration successful.";
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
                .build();
    }
}