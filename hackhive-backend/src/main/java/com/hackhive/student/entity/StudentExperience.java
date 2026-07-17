package com.hackhive.student.entity;

import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "student_experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentExperience extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(nullable = false, length = 100)
    private String role;

    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @Column(length = 100)
    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "currently_working", nullable = false)
    private Boolean currentlyWorking;

    @Column(length = 1000)
    private String description;
}