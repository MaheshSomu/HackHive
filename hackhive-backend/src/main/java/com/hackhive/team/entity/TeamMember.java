package com.hackhive.team.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "team_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "team_id",
                                "student_profile_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_profile_id",
            nullable = false
    )
    private StudentProfile studentProfile;

    @Column(nullable = false, length = 50)
    private String role;
}