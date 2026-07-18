package com.hackhive.team.repository;

import com.hackhive.student.entity.StudentProfile;
import com.hackhive.team.entity.Team;
import com.hackhive.team.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository
        extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByTeam(Team team);

    List<TeamMember> findByStudentProfile(
            StudentProfile studentProfile
    );

    boolean existsByTeamAndStudentProfile(
            Team team,
            StudentProfile studentProfile
    );

    Optional<TeamMember> findByTeamAndStudentProfile(
            Team team,
            StudentProfile studentProfile
    );

    long countByTeam(Team team);
}