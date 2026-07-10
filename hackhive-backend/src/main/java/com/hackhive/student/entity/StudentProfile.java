package com.hackhive.student.entity;

import com.hackhive.auth.entity.User;
import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 150)
    private String college;

    @Column(length = 100)
    private String branch;

    @Column(length = 10)
    private String graduationYear;

    @Column(length = 500)
    private String bio;

    @Column(length = 255)
    private String githubUrl;

    @Column(length = 255)
    private String linkedinUrl;

    @Column(length = 255)
    private String portfolioUrl;

    @Column(length = 255)
    private String profileImageUrl;

    @Column(length = 150)
    private String university;

    @Column(length = 100)
    private String degree;

    private Double cgpa;

    @Column(length = 100)
    private String location;

    @Column(length = 255)
    private String resumeUrl;
}