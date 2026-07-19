package com.hackhive.workspace.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.workspace.dto.request.SendChatMessageRequest;
import com.hackhive.workspace.dto.response.ChatMessageResponse;
import com.hackhive.workspace.service.ChatMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    /**
     * Send and save a new message.
     */
    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @Valid @RequestBody SendChatMessageRequest request) {

        ChatMessageResponse response =
                chatMessageService.sendMessage(request);

        return ResponseEntity.ok(
                ApiResponse.<ChatMessageResponse>builder()
                        .success(true)
                        .message("Message sent successfully.")
                        .data(response)
                        .build()
        );
    }

    /**
     * Get complete chat history for a team.
     */
    @GetMapping("/teams/{teamId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>>
    getTeamChatHistory(
            @PathVariable Long teamId) {

        List<ChatMessageResponse> response =
                chatMessageService.getTeamChatHistory(teamId);

        return ResponseEntity.ok(
                ApiResponse.<List<ChatMessageResponse>>builder()
                        .success(true)
                        .message("Team chat history fetched successfully.")
                        .data(response)
                        .build()
        );
    }
}