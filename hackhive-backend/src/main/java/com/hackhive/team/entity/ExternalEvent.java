package com.hackhive.team.entity;

import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "external_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalEvent extends BaseEntity {

    @Column(name = "event_name", nullable = false, length = 150)
    private String eventName;

    @Column(name = "organizer_name", nullable = false, length = 150)
    private String organizerName;

    @Column(name = "event_date", length = 50)
    private String eventDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
