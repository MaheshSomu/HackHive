package com.hackhive.team.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.event.entity.Event;
import com.hackhive.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id", nullable = false)
    private StudentProfile leader;

    @Column(name = "college_name", length = 200)
    private String collegeName;

    @Column(name = "max_members", nullable = false)
    private Integer maxMembers;

    @Column(nullable = false)
    @Builder.Default
    private Boolean open = true;
}