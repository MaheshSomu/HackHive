package com.hackhive.workspace.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.team.entity.Team;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private StudentProfile sender;

    @Column(nullable = false, length = 2000)
    private String content;
}