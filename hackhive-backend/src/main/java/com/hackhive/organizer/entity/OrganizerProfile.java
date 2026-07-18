package com.hackhive.organizer.entity;

import com.hackhive.auth.entity.User;
import com.hackhive.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "organization_name", nullable = false, length = 150)
    private String organizationName;

    @Column(name = "organization_type", length = 100)
    private String organizationType;

    @Column(length = 1000)
    private String description;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(length = 150)
    private String location;

    @Column(nullable = false)
    private Boolean verified = false;
}