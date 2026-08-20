package com.hackhive.student.entity;

import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "student_workspace_preferences",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_student_profile_workspace_pref",
            columnNames = {"student_profile_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentWorkspacePreference extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false, unique = true)
    private StudentProfile studentProfile;

    @Builder.Default
    @Column(name = "theme", nullable = false, length = 20)
    private String theme = "system";
}
