package com.hackhive.event.entity;

import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_registration_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistrationMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_registration_id", nullable = false)
    private EventRegistration eventRegistration;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 150)
    private String college;

    @Column(length = 100)
    private String branch;

    @Column(name = "graduation_year", length = 10)
    private String graduationYear;

    @Column(name = "is_primary", nullable = false)
    @Builder.Default
    private Boolean isPrimary = false;

    @Column(name = "member_index", nullable = false)
    @Builder.Default
    private Integer memberIndex = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id")
    private com.hackhive.student.entity.StudentProfile studentProfile;

    @Column(name = "is_hackhive_member")
    @Builder.Default
    private Boolean isHackHiveMember = false;
}
