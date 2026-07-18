package com.hackhive.team.mapper;

import com.hackhive.team.dto.response.TeamMemberResponse;
import com.hackhive.team.entity.TeamMember;
import org.springframework.stereotype.Component;

@Component
public class TeamMemberMapper {

    public TeamMemberResponse toResponse(
            TeamMember teamMember) {

        return TeamMemberResponse.builder()
                .memberId(teamMember.getId())
                .studentProfileId(
                        teamMember.getStudentProfile().getId())
                .fullName(
                        teamMember.getStudentProfile()
                                .getUser()
                                .getFullName())
                .email(
                        teamMember.getStudentProfile()
                                .getUser()
                                .getEmail())
                .college(
                        teamMember.getStudentProfile()
                                .getCollege())
                .branch(
                        teamMember.getStudentProfile()
                                .getBranch())
                .role(teamMember.getRole())
                .build();
    }
}