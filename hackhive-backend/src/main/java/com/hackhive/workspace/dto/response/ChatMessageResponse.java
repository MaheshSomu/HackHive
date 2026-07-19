package com.hackhive.workspace.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatMessageResponse {

    private Long id;

    private Long teamId;

    private String teamName;

    private Long senderId;

    private String senderName;

    private String content;

    private LocalDateTime sentAt;
}