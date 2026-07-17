package com.hackhive.student.service;

import com.hackhive.student.dto.request.AddProjectRequest;
import com.hackhive.student.dto.request.UpdateProjectRequest;
import com.hackhive.student.dto.response.ProjectResponse;

import java.util.List;

public interface StudentProjectService {

    ProjectResponse addProject(
            AddProjectRequest request
    );

    List<ProjectResponse> getMyProjects();

    ProjectResponse updateProject(
            Long id,
            UpdateProjectRequest request
    );

    void deleteProject(Long id);
}