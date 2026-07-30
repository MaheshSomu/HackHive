package com.hackhive.config;

import com.hackhive.auth.entity.Role;
import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.RoleRepository;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.enums.RoleType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:}")
    private String adminEmail;

    @Value("${admin.password:}")
    private String adminPassword;

    @Override
    public void run(String... args) {

        // If credentials are not configured, skip admin creation.
        if (adminEmail == null
                || adminEmail.isBlank()
                || adminPassword == null
                || adminPassword.isBlank()) {

            System.out.println(
                    "Admin credentials not configured. "
                            + "Skipping default admin creation."
            );

            return;
        }

        String normalizedEmail =
                adminEmail.trim().toLowerCase();

        // Do not create duplicate admin account.
        if (userRepository
                .findByEmail(normalizedEmail)
                .isPresent()) {

            System.out.println(
                    "Admin account already exists."
            );

            return;
        }

        Role adminRole =
                roleRepository
                        .findByName(RoleType.ADMIN)
                        .orElseGet(() ->
                                roleRepository.save(
                                        Role.builder()
                                                .name(RoleType.ADMIN)
                                                .build()
                                )
                        );

        User admin =
                User.builder()
                        .fullName("HackHive Admin")
                        .email(normalizedEmail)
                        .password(
                                passwordEncoder.encode(
                                        adminPassword
                                )
                        )
                        .enabled(true)
                        .emailVerified(true)
                        .role(adminRole)
                        .build();

        userRepository.save(admin);

        System.out.println(
                "Default admin account created successfully."
        );
    }
}