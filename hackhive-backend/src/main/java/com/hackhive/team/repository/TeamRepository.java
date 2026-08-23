package com.hackhive.team.repository;

import com.hackhive.event.entity.Event;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.team.entity.Team;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    boolean existsByEvent(Event event);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM Team t WHERE t.id = :id")
    Optional<Team> findByIdForUpdate(@Param("id") Long id);
}