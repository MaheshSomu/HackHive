package com.hackhive.workspace.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.entity.Team;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import com.hackhive.workspace.dto.request.SendChatMessageRequest;
import com.hackhive.workspace.dto.response.ChatMessageResponse;
import com.hackhive.workspace.entity.ChatMessage;
import com.hackhive.workspace.mapper.ChatMessageMapper;
import com.hackhive.workspace.repository.ChatMessageRepository;
import com.hackhive.workspace.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl
        implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final ChatMessageMapper chatMessageMapper;

    /**
     * Get the currently logged-in student's profile
     * using the authenticated user's email.
     */
    private StudentProfile getCurrentStudentProfile() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new BadRequestException(
                    "User is not authenticated."
            );
        }

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));

        return studentProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found."
                        ));
    }

    /**
     * Get a team by its ID.
     */
    private Team getTeam(Long teamId) {

        return teamRepository
                .findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found."
                        ));
    }

    /**
     * Verify that the student belongs to the team.
     */
    private void validateTeamMember(
            Team team,
            StudentProfile studentProfile) {

        boolean isMember =
                teamMemberRepository
                        .existsByTeamAndStudentProfile(
                                team,
                                studentProfile
                        );

        if (!isMember) {
            throw new BadRequestException(
                    "You are not a member of this team."
            );
        }
    }

    /**
     * Send and permanently store a team chat message.
     */
    @Override
    @Transactional
    public ChatMessageResponse sendMessage(
            SendChatMessageRequest request) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team =
                getTeam(request.getTeamId());

        // Only members of this team can send messages
        validateTeamMember(
                team,
                currentStudent
        );

        String content =
                request.getContent().trim();

        if (content.isEmpty()) {
            throw new BadRequestException(
                    "Message content cannot be empty."
            );
        }

        ChatMessage chatMessage =
                ChatMessage.builder()
                        .team(team)
                        .sender(currentStudent)
                        .content(content)
                        .build();

        chatMessage =
                chatMessageRepository.save(chatMessage);

        return chatMessageMapper
                .toResponse(chatMessage);
    }

    /**
     * Get complete chat history for a team.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getTeamChatHistory(
            Long teamId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team =
                getTeam(teamId);

        // Only members of this team can read chat history
        validateTeamMember(
                team,
                currentStudent
        );

        return chatMessageRepository
                .findByTeamOrderByCreatedAtAsc(team)
                .stream()
                .map(chatMessageMapper::toResponse)
                .toList();
    }
    private StudentProfile getStudentProfileByEmail(
        String email) {

    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found."
                    ));

    return studentProfileRepository
            .findByUser(user)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Student profile not found."
                    ));
    }
    @Override
    @Transactional
    public ChatMessageResponse sendMessage(
            SendChatMessageRequest request,
            String email) {

        StudentProfile currentStudent =
                getStudentProfileByEmail(email);

        Team team =
                getTeam(request.getTeamId());

        // Only members of the team can send messages
        validateTeamMember(
                team,
                currentStudent
        );

        String content =
                request.getContent().trim();

        if (content.isEmpty()) {
            throw new BadRequestException(
                    "Message content cannot be empty."
            );
        }

        ChatMessage chatMessage =
                ChatMessage.builder()
                        .team(team)
                        .sender(currentStudent)
                        .content(content)
                        .build();

        chatMessage =
                chatMessageRepository.save(chatMessage);

        return chatMessageMapper
                .toResponse(chatMessage);
    }
}