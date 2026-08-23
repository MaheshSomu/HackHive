package com.hackhive.event.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventRegistrationMemberResponse {

    private Long id;

    private String fullName;

    private String email;

    private String college;

    private String branch;

    private String graduationYear;

    private Boolean isPrimary;

    private Integer memberIndex;

    private Long studentProfileId;

    private Boolean isHackHiveMember;
}
