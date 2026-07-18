package com.hackhive.organizer.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrganizerProfileRequest {

    @NotBlank(message = "Organization name is required")
    private String organizationName;

    private String organizationType;

    private String description;

    private String websiteUrl;

    @Email(message = "Invalid contact email")
    private String contactEmail;

    private String contactPhone;

    private String logoUrl;

    private String location;
}