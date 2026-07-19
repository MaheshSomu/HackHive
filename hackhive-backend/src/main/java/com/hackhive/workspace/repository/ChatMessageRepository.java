package com.hackhive.workspace.repository;

import com.hackhive.team.entity.Team;
import com.hackhive.workspace.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    // Get complete chat history for a team
    // ordered from oldest message to newest message
    List<ChatMessage> findByTeamOrderByCreatedAtAsc(
            Team team
    );
}