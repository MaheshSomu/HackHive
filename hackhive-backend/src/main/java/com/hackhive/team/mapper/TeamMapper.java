package com.hackhive.team.mapper;

import com.hackhive.team.dto.response.ExternalEventResponse;
import com.hackhive.team.dto.response.TeamResponse;
import com.hackhive.team.entity.ExternalEvent;
import com.hackhive.team.entity.Team;
import com.hackhive.team.enums.EventType;
import com.hackhive.team.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TeamMapper {

    private final TeamMemberRepository teamMemberRepository;

    public TeamResponse toResponse(Team team) {
        if (team == null) {
            return null;
        }

        long currentMembers = teamMemberRepository.countByTeam(team);

        Long eventId = team.getEvent() != null ? team.getEvent().getId() : null;
        String eventTitle = team.getEvent() != null ? team.getEvent().getTitle() :
                (team.getExternalEvent() != null ? team.getExternalEvent().getEventName() : null);

        ExternalEventResponse externalEventResponse = null;
        if (team.getExternalEvent() != null) {
            ExternalEvent ext = team.getExternalEvent();
            externalEventResponse = ExternalEventResponse.builder()
                    .id(ext.getId())
                    .eventName(ext.getEventName())
                    .organizerName(ext.getOrganizerName())
                    .eventDate(ext.getEventDate())
                    .description(ext.getDescription())
                    .build();
        }

        Long leaderId = null;
        String leaderName = null;
        if (team.getLeader() != null && team.getLeader().getUser() != null) {
            leaderId = team.getLeader().getUser().getId();
            leaderName = team.getLeader().getUser().getFullName();
        }

        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .eventId(eventId)
                .eventTitle(eventTitle)
                .eventType(team.getEventType() != null ? team.getEventType() : EventType.HACKHIVE)
                .externalEvent(externalEventResponse)
                .leaderId(leaderId)
                .leaderName(leaderName)
                .collegeName(team.getCollegeName())
                .maxMembers(team.getMaxMembers())
                .currentMembers(currentMembers)
                .open(team.getOpen())
                .build();
    }
}