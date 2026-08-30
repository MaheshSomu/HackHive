package com.hackhive.submission.repository;

import com.hackhive.submission.entity.ProjectSubmission;
import com.hackhive.submission.enums.ProjectSubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectSubmissionRepository extends JpaRepository<ProjectSubmission, Long> {

    Optional<ProjectSubmission> findByTeamId(Long teamId);

    Optional<ProjectSubmission> findByEventIdAndTeamId(Long eventId, Long teamId);

    List<ProjectSubmission> findByEventIdOrderByCreatedAtDesc(Long eventId);

    List<ProjectSubmission> findByEventIdAndSubmissionStatusOrderByCreatedAtDesc(Long eventId, ProjectSubmissionStatus submissionStatus);

    long countByEventIdAndSubmissionStatus(Long eventId, ProjectSubmissionStatus submissionStatus);

    boolean existsByTeamId(Long teamId);

    boolean existsByEventIdAndTeamId(Long eventId, Long teamId);
}
