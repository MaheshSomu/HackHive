package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.StudentWorkspacePreferenceResponse;
import com.hackhive.student.entity.StudentWorkspacePreference;
import org.springframework.stereotype.Component;

@Component
public class StudentWorkspacePreferenceMapper {

    public StudentWorkspacePreferenceResponse toResponse(StudentWorkspacePreference preference) {
        if (preference == null) {
            return null;
        }

        return StudentWorkspacePreferenceResponse.builder()
                .theme(preference.getTheme())
                .build();
    }
}
