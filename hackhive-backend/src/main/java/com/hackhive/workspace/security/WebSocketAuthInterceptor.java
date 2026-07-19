package com.hackhive.workspace.security;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.auth.security.JwtService;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.entity.Team;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor
        implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);

        // Authenticate user when WebSocket connection is established
        if (StompCommand.CONNECT.equals(
                accessor.getCommand())) {

            authenticateUser(accessor);
        }

        // Authorize team chat subscription
        if (StompCommand.SUBSCRIBE.equals(
                accessor.getCommand())) {

            authorizeSubscription(accessor);
        }

        return message;
    }

    private void authenticateUser(
            StompHeaderAccessor accessor) {

        String authorizationHeader =
                accessor.getFirstNativeHeader(
                        "Authorization"
                );

        if (authorizationHeader == null
                || !authorizationHeader.startsWith(
                        "Bearer ")) {

            throw new IllegalArgumentException(
                    "Missing or invalid Authorization header."
            );
        }

        String token =
                authorizationHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {

            throw new IllegalArgumentException(
                    "Invalid or expired JWT token."
            );
        }

        String email =
                jwtService.extractEmail(token);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        Collections.emptyList()
                );

        accessor.setUser(authentication);
    }

    private void authorizeSubscription(
            StompHeaderAccessor accessor) {

        Principal principal =
                accessor.getUser();

        if (principal == null) {
            throw new IllegalArgumentException(
                    "WebSocket user is not authenticated."
            );
        }

        String destination =
                accessor.getDestination();

        if (destination == null) {
            throw new IllegalArgumentException(
                    "Subscription destination is required."
            );
        }

        String prefix =
                "/topic/teams/";

        String suffix =
                "/chat";

        // Only apply this authorization logic
        // to team chat destinations
        if (!destination.startsWith(prefix)
                || !destination.endsWith(suffix)) {

            return;
        }

        String teamIdValue =
                destination.substring(
                        prefix.length(),
                        destination.length()
                                - suffix.length()
                );

        Long teamId;

        try {
            teamId =
                    Long.parseLong(teamIdValue);
        } catch (NumberFormatException exception) {

            throw new IllegalArgumentException(
                    "Invalid team chat destination."
            );
        }

        User user =
                userRepository
                        .findByEmail(principal.getName())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found."
                                ));

        StudentProfile studentProfile =
                studentProfileRepository
                        .findByUser(user)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Student profile not found."
                                ));

        Team team =
                teamRepository
                        .findById(teamId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Team not found."
                                ));

        boolean isMember =
                teamMemberRepository
                        .existsByTeamAndStudentProfile(
                                team,
                                studentProfile
                        );

        if (!isMember) {
            throw new IllegalArgumentException(
                    "You are not authorized to subscribe "
                            + "to this team's chat."
            );
        }
    }
}