package com.hackhive.submission.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.event.entity.Event;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.submission.enums.ProjectSubmissionStatus;
import com.hackhive.team.entity.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "project_submissions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_project_submission_event_team",
                        columnNames = {
                                "event_id",
                                "team_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSubmission extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by_student_id", nullable = false)
    private StudentProfile submittedBy;

    @Column(name = "project_title", nullable = false, length = 200)
    private String projectTitle;

    @Column(name = "problem_statement", columnDefinition = "TEXT")
    private String problemStatement;

    @Column(name = "project_description", columnDefinition = "TEXT")
    private String projectDescription;

    @Column(name = "technologies_used", length = 500)
    private String technologiesUsed;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "demo_url", length = 255)
    private String demoUrl;

    @Column(name = "presentation_url", length = 255)
    private String presentationUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "submission_status", nullable = false, length = 30)
    @Builder.Default
    private ProjectSubmissionStatus submissionStatus = ProjectSubmissionStatus.DRAFT;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
}
