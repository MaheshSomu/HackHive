package com.hackhive.student.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentLookupResponse {

    private Boolean exists;

    private Long studentProfileId;

    private String fullName;

    private String email;

    private String college;

    private String branch;

    private String graduationYear;
}
