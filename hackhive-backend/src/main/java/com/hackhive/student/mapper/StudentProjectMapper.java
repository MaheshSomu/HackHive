package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.ProjectResponse;
import com.hackhive.student.entity.StudentProject;
import org.springframework.stereotype.Component;

@Component
public class StudentProjectMapper {

    public ProjectResponse toResponse(
            StudentProject project) {

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .techStack(project.getTechStack())
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getLiveUrl())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .build();
    }
}