package com.hackhive.auth.entity;

import java.time.LocalDateTime;

import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import com.hackhive.auth.enums.AuthProvider;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 15)
    private String phoneNumber;

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean emailVerified = false;

    @Column(unique = true)
    private String emailVerificationToken;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    private LocalDateTime emailVerificationTokenExpiry;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_token_expiry")
    private LocalDateTime passwordResetTokenExpiry;

    @Column(name = "account_reactivation_token")
    private String accountReactivationToken;

    @Column(name = "account_reactivation_token_expiry")
    private LocalDateTime accountReactivationTokenExpiry;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false)
    @Builder.Default
    private AuthProvider authProvider = AuthProvider.LOCAL;

    public AuthProvider getAuthProvider() {
        return authProvider == null ? AuthProvider.LOCAL : authProvider;
    }
}