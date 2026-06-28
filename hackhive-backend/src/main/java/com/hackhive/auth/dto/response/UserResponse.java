package com.hackhive.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String role;
}