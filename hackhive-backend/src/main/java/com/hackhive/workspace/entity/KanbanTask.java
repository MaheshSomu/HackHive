package com.hackhive.workspace.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.team.entity.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "kanban_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KanbanTask extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private StudentProfile assignedTo;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "TODO";

    @Column(length = 50)
    @Builder.Default
    private String priority = "MEDIUM";

    @Column(name = "due_date")
    private LocalDateTime dueDate;
}