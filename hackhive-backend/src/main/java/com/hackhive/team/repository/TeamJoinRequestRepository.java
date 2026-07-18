package com.hackhive.team.repository;

import com.hackhive.student.entity.StudentProfile;
import com.hackhive.team.entity.Team;
import com.hackhive.team.entity.TeamJoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamJoinRequestRepository
        extends JpaRepository<TeamJoinRequest, Long> {

    List<TeamJoinRequest> findByTeam(Team team);

    List<TeamJoinRequest> findByTeamAndStatus(
            Team team,
            String status
    );

    List<TeamJoinRequest> findByStudentProfile(
            StudentProfile studentProfile
    );

    Optional<TeamJoinRequest>
    findByTeamAndStudentProfile(
            Team team,
            StudentProfile studentProfile
    );

    boolean existsByTeamAndStudentProfileAndStatus(
            Team team,
            StudentProfile studentProfile,
            String status
    );
}