package com.hackhive.event.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistrationMemberRequest {

    @NotBlank(message = "Member full name is required.")
    private String fullName;

    @NotBlank(message = "Member email is required.")
    @Email(message = "Please provide a valid member email address.")
    private String email;

    private String college;

    private String branch;

    private String graduationYear;

    private Boolean isPrimary;

    private Long studentProfileId;
}
