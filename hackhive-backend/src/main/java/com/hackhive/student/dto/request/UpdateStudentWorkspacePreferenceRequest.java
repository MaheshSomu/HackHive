package com.hackhive.student.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStudentWorkspacePreferenceRequest {

    @NotBlank(message = "Theme cannot be blank.")
    private String theme;
}
