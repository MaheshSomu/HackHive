package com.hackhive.auth.dto.request;

import com.hackhive.common.enums.RoleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OAuthCompleteRegistrationRequest {

    @NotBlank
    private String registrationId;

    @NotNull
    private RoleType role;
}