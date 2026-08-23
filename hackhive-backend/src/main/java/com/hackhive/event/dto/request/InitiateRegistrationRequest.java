package com.hackhive.event.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitiateRegistrationRequest {

    @NotBlank(message = "Full name is required.")
    private String fullName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Please provide a valid email address.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    private String phoneNumber;

    private String college;

    private String branch;

    private String graduationYear;

    @Min(value = 1, message = "Participant count must be at least 1.")
    @Builder.Default
    private Integer participantCount = 1;

    private List<EventRegistrationMemberRequest> members;

    private Boolean forceRefresh;
}
