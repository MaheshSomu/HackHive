package com.hackhive.submission.repository;

import com.hackhive.submission.entity.ProjectResult;
import com.hackhive.submission.enums.ProjectResultStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectResultRepository extends JpaRepository<ProjectResult, Long> {

    Optional<ProjectResult> findByProjectSubmissionId(Long projectSubmissionId);

    List<ProjectResult> findByEventId(Long eventId);

    List<ProjectResult> findByEventIdAndStatus(Long eventId, ProjectResultStatus status);

    boolean existsByEventIdAndRank(Long eventId, Integer rank);

    boolean existsByProjectSubmissionId(Long projectSubmissionId);
}
