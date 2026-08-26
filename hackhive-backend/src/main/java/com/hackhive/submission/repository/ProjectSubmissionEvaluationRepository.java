package com.hackhive.submission.repository;

import com.hackhive.submission.entity.ProjectSubmissionEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectSubmissionEvaluationRepository extends JpaRepository<ProjectSubmissionEvaluation, Long> {

    Optional<ProjectSubmissionEvaluation> findByProjectSubmissionId(Long projectSubmissionId);

    boolean existsByProjectSubmissionId(Long projectSubmissionId);
}
