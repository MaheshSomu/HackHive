package com.hackhive.workspace.mapper;

import com.hackhive.workspace.dto.response.ChatMessageResponse;
import com.hackhive.workspace.entity.ChatMessage;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageMapper {

    public ChatMessageResponse toResponse(
            ChatMessage chatMessage) {

        return ChatMessageResponse.builder()
                .id(chatMessage.getId())
                .teamId(chatMessage.getTeam().getId())
                .teamName(chatMessage.getTeam().getName())
                .senderId(chatMessage.getSender().getId())
                .senderName(
                        chatMessage.getSender()
                                .getUser()
                                .getFullName()
                )
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getCreatedAt())
                .build();
    }
}