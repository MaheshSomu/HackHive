package com.hackhive.team.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.entity.Team;
import com.hackhive.team.entity.TeamMember;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import com.hackhive.team.service.TeamMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeamMemberServiceImpl
        implements TeamMemberService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    /**
     * Get currently logged-in student's profile.
     */
    private StudentProfile getCurrentStudentProfile() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

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
     * Get team by ID.
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
     * Reopen a team if it now has available space.
     */
    private void reopenTeamIfSpaceAvailable(
            Team team) {

        long currentMembers =
                teamMemberRepository.countByTeam(team);

        if (currentMembers < team.getMaxMembers()
                && !Boolean.TRUE.equals(team.getOpen())) {

            team.setOpen(true);
            teamRepository.save(team);
        }
    }

    /**
     * Current logged-in member leaves the team.
     */
    @Override
    @Transactional
    public void leaveTeam(Long teamId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team = getTeam(teamId);

        // Leader cannot leave their own team.
        if (team.getLeader()
                .getId()
                .equals(currentStudent.getId())) {

            throw new BadRequestException(
                    "Team leader cannot leave the team. "
                            + "Delete the team instead."
            );
        }

        TeamMember teamMember =
                teamMemberRepository
                        .findByTeamAndStudentProfile(
                                team,
                                currentStudent
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "You are not a member of this team."
                                ));

        teamMemberRepository.delete(teamMember);

        reopenTeamIfSpaceAvailable(team);
    }

    /**
     * Team leader removes another member.
     */
    @Override
    @Transactional
    public void removeMember(
            Long teamId,
            Long studentProfileId) {

        StudentProfile leader =
                getCurrentStudentProfile();

        Team team =
                teamRepository
                        .findByIdAndLeader(
                                teamId,
                                leader
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Team not found or you are not the team leader."
                                ));

        // Leader cannot remove themselves.
        if (leader.getId()
                .equals(studentProfileId)) {

            throw new BadRequestException(
                    "Team leader cannot remove themselves."
            );
        }

        StudentProfile memberStudent =
                studentProfileRepository
                        .findById(studentProfileId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student profile not found."
                                ));

        TeamMember teamMember =
                teamMemberRepository
                        .findByTeamAndStudentProfile(
                                team,
                                memberStudent
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student is not a member of this team."
                                ));

        teamMemberRepository.delete(teamMember);

        reopenTeamIfSpaceAvailable(team);
    }
}