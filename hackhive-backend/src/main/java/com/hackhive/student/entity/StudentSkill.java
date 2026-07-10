package com.hackhive.student.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.student.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSkill extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Column(nullable = false, length = 100)
    private String skillName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillLevel skillLevel;
}