package com.hackhive.submission.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.event.entity.Event;
import com.hackhive.submission.enums.ProjectResultStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "project_results",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_project_result_submission",
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
public class ProjectResult extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_submission_id", nullable = false)
    private ProjectSubmission projectSubmission;

    @Column(name = "rank_position")
    private Integer rank;

    @Column(name = "award_title", length = 150)
    private String awardTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ProjectResultStatus status = ProjectResultStatus.DRAFT;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}
