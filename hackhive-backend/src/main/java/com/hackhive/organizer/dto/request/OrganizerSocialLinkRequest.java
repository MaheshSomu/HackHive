package com.hackhive.organizer.dto.request;

import com.hackhive.organizer.enums.SocialPlatform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerSocialLinkRequest {

    @NotNull(message = "Platform is required.")
    private SocialPlatform platform;

    @NotBlank(message = "URL cannot be blank.")
    @Size(max = 255, message = "URL must not exceed 255 characters.")
    private String url;
}
