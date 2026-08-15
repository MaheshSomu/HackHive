package com.hackhive.organizer.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.organizer.enums.SocialPlatform;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "organizer_social_links",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_organizer_profile_platform",
            columnNames = {"organizer_profile_id", "platform"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerSocialLink extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_profile_id", nullable = false)
    private OrganizerProfile organizerProfile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SocialPlatform platform;

    @Column(nullable = false, length = 255)
    private String url;
}
