package com.hackhive.event.entity;

import com.hackhive.common.entity.BaseEntity;
import com.hackhive.event.enums.PaymentStatus;
import com.hackhive.event.enums.RegistrationStatus;
import com.hackhive.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "event_registrations",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "event_id",
                                "student_profile_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistration extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_profile_id",
            nullable = false
    )
    private StudentProfile studentProfile;

    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status", nullable = false, length = 30)
    @Builder.Default
    private RegistrationStatus status = RegistrationStatus.CONFIRMED;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.NOT_APPLICABLE;

    @Column(name = "amount_paid", precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id", length = 100)
    private String razorpayPaymentId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "participant_count")
    @Builder.Default
    private Integer participantCount = 1;

    @OneToMany(mappedBy = "eventRegistration", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.List<EventRegistrationMember> members = new java.util.ArrayList<>();
}