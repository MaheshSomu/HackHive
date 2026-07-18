package com.hackhive.team.repository;

import com.hackhive.event.entity.Event;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByEvent(Event event);

    List<Team> findByLeader(StudentProfile leader);

    List<Team> findByCollegeNameContainingIgnoreCase(
            String collegeName
    );

    List<Team> findByNameContainingIgnoreCase(
            String name
    );

    List<Team> findByOpenTrue();

    Optional<Team> findByIdAndLeader(
            Long id,
            StudentProfile leader
    );
}