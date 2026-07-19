package com.hackhive.workspace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendChatMessageRequest {

    @NotNull(message = "Team ID is required")
    private Long teamId;

    @NotBlank(message = "Message content is required")
    @Size(
            max = 2000,
            message = "Message cannot exceed 2000 characters"
    )
    private String content;
}