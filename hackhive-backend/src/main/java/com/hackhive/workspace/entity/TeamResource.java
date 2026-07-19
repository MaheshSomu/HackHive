package com.hackhive.workspace.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.team.entity.Team;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "team_resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamResource extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by_id", nullable = false)
    private StudentProfile addedBy;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String resourceUrl;

    @Column(nullable = false, length = 50)
    private String resourceType;
}