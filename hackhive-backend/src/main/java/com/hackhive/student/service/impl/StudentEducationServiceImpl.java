package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.AddEducationRequest;
import com.hackhive.student.dto.request.UpdateEducationRequest;
import com.hackhive.student.dto.response.EducationResponse;
import com.hackhive.student.entity.StudentEducation;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.mapper.StudentEducationMapper;
import com.hackhive.student.repository.StudentEducationRepository;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.service.StudentEducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentEducationServiceImpl
        implements StudentEducationService {

    private final StudentEducationRepository studentEducationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentEducationMapper studentEducationMapper;

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
    public EducationResponse addEducation(
            AddEducationRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentEducation education = StudentEducation.builder()
                .studentProfile(profile)
                .institution(request.getInstitution())
                .degree(request.getDegree())
                .fieldOfStudy(request.getFieldOfStudy())
                .startYear(request.getStartYear())
                .endYear(request.getEndYear())
                .cgpa(request.getCgpa())
                .description(request.getDescription())
                .build();

        education = studentEducationRepository.save(education);

        return studentEducationMapper.toResponse(education);
    }

    @Override
    public List<EducationResponse> getEducations() {

        StudentProfile profile = getCurrentStudentProfile();

        return studentEducationRepository
                .findByStudentProfile(profile)
                .stream()
                .map(studentEducationMapper::toResponse)
                .toList();
    }

    @Override
    public EducationResponse updateEducation(
            Long educationId,
            UpdateEducationRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentEducation education =
                studentEducationRepository
                        .findByIdAndStudentProfile(
                                educationId, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Education not found."));

        education.setInstitution(request.getInstitution());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setStartYear(request.getStartYear());
        education.setEndYear(request.getEndYear());
        education.setCgpa(request.getCgpa());
        education.setDescription(request.getDescription());

        education = studentEducationRepository.save(education);

        return studentEducationMapper.toResponse(education);
    }

    @Override
    public void deleteEducation(Long educationId) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentEducation education =
                studentEducationRepository
                        .findByIdAndStudentProfile(
                                educationId, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Education not found."));

        studentEducationRepository.delete(education);
    }
}