package com.hackhive.event.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.organizer.entity.OrganizerProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_profile_id", nullable = false)
    private OrganizerProfile organizerProfile;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "event_mode", nullable = false, length = 50)
    private String eventMode;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "registration_start_date")
    private LocalDateTime registrationStartDate;

    @Column(name = "registration_end_date", nullable = false)
    private LocalDateTime registrationEndDate;

    @Column(name = "min_team_size")
    private Integer minTeamSize;

    @Column(name = "max_team_size")
    private Integer maxTeamSize;

    @Column(length = 1000)
    private String eligibility;

    @Column(name = "banner_url", length = 255)
    private String bannerUrl;

    @Column(name = "college_name", length = 200)
    private String collegeName;
}