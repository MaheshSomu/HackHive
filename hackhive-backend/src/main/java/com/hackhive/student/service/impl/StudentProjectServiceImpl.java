package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.AddProjectRequest;
import com.hackhive.student.dto.request.UpdateProjectRequest;
import com.hackhive.student.dto.response.ProjectResponse;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentProject;
import com.hackhive.student.mapper.StudentProjectMapper;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.repository.StudentProjectRepository;
import com.hackhive.student.service.StudentProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentProjectServiceImpl
        implements StudentProjectService {

    private final StudentProjectRepository studentProjectRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentProjectMapper studentProjectMapper;

    private StudentProfile getCurrentStudentProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        return studentProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found."));
    }

    @Override
    public ProjectResponse addProject(
            AddProjectRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentProject project = StudentProject.builder()
                .studentProfile(profile)
                .title(request.getTitle())
                .description(request.getDescription())
                .techStack(request.getTechStack())
                .githubUrl(request.getGithubUrl())
                .liveUrl(request.getLiveUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        project = studentProjectRepository.save(project);

        return studentProjectMapper.toResponse(project);
    }

    @Override
    public List<ProjectResponse> getMyProjects() {

        StudentProfile profile = getCurrentStudentProfile();

        return studentProjectRepository
                .findByStudentProfile(profile)
                .stream()
                .map(studentProjectMapper::toResponse)
                .toList();
    }

    @Override
    public ProjectResponse updateProject(
            Long id,
            UpdateProjectRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentProject project =
                studentProjectRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found."));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechStack(request.getTechStack());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveUrl(request.getLiveUrl());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());

        project = studentProjectRepository.save(project);

        return studentProjectMapper.toResponse(project);
    }

    @Override
    public void deleteProject(Long id) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentProject project =
                studentProjectRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found."));

        studentProjectRepository.delete(project);
    }
}