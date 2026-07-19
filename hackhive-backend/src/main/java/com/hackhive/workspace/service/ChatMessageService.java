package com.hackhive.workspace.service;

import com.hackhive.workspace.dto.request.SendChatMessageRequest;
import com.hackhive.workspace.dto.response.ChatMessageResponse;

import java.util.List;

public interface ChatMessageService {

    // Used by REST API
    ChatMessageResponse sendMessage(
            SendChatMessageRequest request
    );

    // Used by WebSocket
    ChatMessageResponse sendMessage(
            SendChatMessageRequest request,
            String email
    );

    // Get complete team chat history
    List<ChatMessageResponse> getTeamChatHistory(
            Long teamId
    );
}