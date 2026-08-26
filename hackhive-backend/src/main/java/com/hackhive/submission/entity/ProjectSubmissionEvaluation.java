package com.hackhive.submission.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.organizer.entity.OrganizerProfile;
import com.hackhive.submission.enums.ProjectEvaluationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "project_submission_evaluations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_evaluation_project_submission",
                        columnNames = {
                                "project_submission_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSubmissionEvaluation extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_submission_id", nullable = false)
    private ProjectSubmission projectSubmission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_profile_id", nullable = false)
    private OrganizerProfile organizerProfile;

    @Column(name = "innovation_score")
    private Integer innovationScore;

    @Column(name = "technical_implementation_score")
    private Integer technicalImplementationScore;

    @Column(name = "problem_relevance_score")
    private Integer problemRelevanceScore;

    @Column(name = "ui_ux_score")
    private Integer uiUxScore;

    @Column(name = "impact_score")
    private Integer impactScore;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "review_comment", columnDefinition = "TEXT")
    private String reviewComment;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ProjectEvaluationStatus status = ProjectEvaluationStatus.DRAFT;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;
}
