package com.hackhive.team.mapper;

import com.hackhive.team.dto.response.TeamResponse;
import com.hackhive.team.entity.Team;
import com.hackhive.team.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TeamMapper {

    private final TeamMemberRepository teamMemberRepository;

    public TeamResponse toResponse(Team team) {

        long currentMembers =
                teamMemberRepository.countByTeam(team);

        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .eventId(team.getEvent().getId())
                .eventTitle(team.getEvent().getTitle())
                .leaderId(team.getLeader().getId())
                .leaderName(
                        team.getLeader()
                                .getUser()
                                .getFullName())
                .collegeName(team.getCollegeName())
                .maxMembers(team.getMaxMembers())
                .currentMembers(currentMembers)
                .open(team.getOpen())
                .build();
    }
}