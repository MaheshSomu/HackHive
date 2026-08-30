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
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        if (StompCommand.CONNECT.equals(command)) {
            authenticateUser(accessor);
        }

        if (StompCommand.SUBSCRIBE.equals(command)) {
            authorizeSubscription(accessor);
        }

        return message;
    }

    private void authenticateUser(StompHeaderAccessor accessor) {
        String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            log.warn("[WebSocketAuth] Missing or invalid Authorization header on CONNECT frame");
            throw new IllegalArgumentException("Missing or invalid Authorization header.");
        }

        String token = authorizationHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            log.warn("[WebSocketAuth] Invalid or expired JWT token on CONNECT frame");
            throw new IllegalArgumentException("Invalid or expired JWT token.");
        }

        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            log.warn("[WebSocketAuth] User not found for email: {}", email);
            return new IllegalArgumentException("User not found.");
        });

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            log.warn("[WebSocketAuth] User account is disabled: {}", email);
            throw new IllegalArgumentException("User account is disabled.");
        }

        if (!"STUDENT".equals(user.getRole().getName().name())) {
            log.warn("[WebSocketAuth] Non-student role attempted team chat access: {}", email);
            throw new IllegalArgumentException("Only students can access team chat.");
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());

        accessor.setUser(authentication);

        // Explicitly preserve user authentication in session attributes for subsequent STOMP frames
        Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
        if (sessionAttributes != null) {
            sessionAttributes.put("simpUser", authentication);
            sessionAttributes.put("user", authentication);
        }
    }

    private void authorizeSubscription(StompHeaderAccessor accessor) {
        Principal principal = accessor.getUser();

        // Fallback to session attributes if accessor.getUser() is null on frame wrapping
        if (principal == null && accessor.getSessionAttributes() != null) {
            Object sessionUser = accessor.getSessionAttributes().get("simpUser");
            if (sessionUser == null) {
                sessionUser = accessor.getSessionAttributes().get("user");
            }
            if (sessionUser instanceof Principal) {
                principal = (Principal) sessionUser;
                accessor.setUser(principal);
            }
        }

        if (principal == null) {
            log.error("[WebSocketAuth] Unauthenticated SUBSCRIBE attempt for destination: {}", accessor.getDestination());
            throw new IllegalArgumentException("WebSocket user is not authenticated.");
        }

        String destination = accessor.getDestination();

        if (destination == null) {
            throw new IllegalArgumentException("Subscription destination is required.");
        }

        String prefix = "/topic/teams/";
        String suffix = "/chat";

        // Only apply team membership authorization logic to team chat destinations
        if (!destination.startsWith(prefix) || !destination.endsWith(suffix)) {
            return;
        }

        String teamIdValue = destination.substring(prefix.length(), destination.length() - suffix.length());
        Long teamId;

        try {
            teamId = Long.parseLong(teamIdValue);
        } catch (NumberFormatException exception) {
            log.error("[WebSocketAuth] Invalid team ID in destination: {}", destination);
            throw new IllegalArgumentException("Invalid team chat destination.");
        }

        final String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> {
            log.error("[WebSocketAuth] User not found for email: {}", userEmail);
            return new IllegalArgumentException("User not found.");
        });

        StudentProfile studentProfile = studentProfileRepository.findByUser(user).orElseThrow(() -> {
            log.error("[WebSocketAuth] Student profile not found for user: {}", user.getEmail());
            return new IllegalArgumentException("Student profile not found.");
        });

        Team team = teamRepository.findById(teamId).orElseThrow(() -> {
            log.error("[WebSocketAuth] Team not found for teamId: {}", teamId);
            return new IllegalArgumentException("Team not found.");
        });

        // Check if student is either team leader or a team member
        boolean isLeader = team.getLeader() != null && studentProfile.getId().equals(team.getLeader().getId());
        boolean isMember = isLeader || teamMemberRepository.existsByTeamAndStudentProfile(team, studentProfile);

        if (!isMember) {
            log.warn("[WebSocketAuth] User {} (profileId={}) unauthorized to subscribe to teamId={}",
                    user.getEmail(), studentProfile.getId(), team.getId());
            throw new IllegalArgumentException("You are not authorized to subscribe to this team's chat.");
        }
    }
}