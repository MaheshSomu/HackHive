package com.hackhive.admin.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminUserResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String role;

    private boolean enabled;

    private boolean emailVerified;
}