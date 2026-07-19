package com.hackhive.workspace.controller;

import com.hackhive.workspace.dto.request.SendChatMessageRequest;
import com.hackhive.workspace.dto.response.ChatMessageResponse;
import com.hackhive.workspace.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(
            SendChatMessageRequest request,
            Principal principal) {

        if (principal == null) {
            throw new IllegalArgumentException(
                    "WebSocket user is not authenticated."
            );
        }

        ChatMessageResponse response =
                chatMessageService.sendMessage(
                        request,
                        principal.getName()
                );

        messagingTemplate.convertAndSend(
                "/topic/teams/"
                        + response.getTeamId()
                        + "/chat",
                response
        );
    }
}