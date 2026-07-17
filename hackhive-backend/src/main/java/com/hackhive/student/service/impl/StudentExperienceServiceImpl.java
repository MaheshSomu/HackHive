package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.AddExperienceRequest;
import com.hackhive.student.dto.request.UpdateExperienceRequest;
import com.hackhive.student.dto.response.ExperienceResponse;
import com.hackhive.student.entity.StudentExperience;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.mapper.StudentExperienceMapper;
import com.hackhive.student.repository.StudentExperienceRepository;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.service.StudentExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentExperienceServiceImpl
        implements StudentExperienceService {

    private final StudentExperienceRepository studentExperienceRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentExperienceMapper studentExperienceMapper;

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
    public ExperienceResponse addExperience(
            AddExperienceRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentExperience experience = StudentExperience.builder()
                .studentProfile(profile)
                .company(request.getCompany())
                .role(request.getRole())
                .employmentType(request.getEmploymentType())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .currentlyWorking(request.getCurrentlyWorking())
                .description(request.getDescription())
                .build();

        experience = studentExperienceRepository.save(experience);

        return studentExperienceMapper.toResponse(experience);
    }

    @Override
    public List<ExperienceResponse> getMyExperiences() {

        StudentProfile profile = getCurrentStudentProfile();

        return studentExperienceRepository
                .findByStudentProfile(profile)
                .stream()
                .map(studentExperienceMapper::toResponse)
                .toList();
    }

    @Override
    public ExperienceResponse updateExperience(
            Long id,
            UpdateExperienceRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentExperience experience =
                studentExperienceRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Experience not found."));

        experience.setCompany(request.getCompany());
        experience.setRole(request.getRole());
        experience.setEmploymentType(request.getEmploymentType());
        experience.setLocation(request.getLocation());
        experience.setStartDate(request.getStartDate());
        experience.setEndDate(request.getEndDate());
        experience.setCurrentlyWorking(request.getCurrentlyWorking());
        experience.setDescription(request.getDescription());

        experience = studentExperienceRepository.save(experience);

        return studentExperienceMapper.toResponse(experience);
    }

    @Override
    public void deleteExperience(Long id) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentExperience experience =
                studentExperienceRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Experience not found."));

        studentExperienceRepository.delete(experience);
    }
}