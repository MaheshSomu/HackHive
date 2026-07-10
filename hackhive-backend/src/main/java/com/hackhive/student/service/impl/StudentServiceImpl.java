package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.UpdateStudentProfileRequest;
import com.hackhive.student.dto.response.StudentProfileResponse;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    @Override
    public StudentProfileResponse getMyProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student profile not found."));

        return mapToResponse(profile);
    }

    @Override
    public StudentProfileResponse updateMyProfile(
            UpdateStudentProfileRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student profile not found."));

        profile.setBio(request.getBio());
        profile.setUniversity(request.getUniversity());
        profile.setCollege(request.getCollege());
        profile.setDegree(request.getDegree());
        profile.setBranch(request.getBranch());
        profile.setGraduationYear(request.getGraduationYear());
        profile.setCgpa(request.getCgpa());
        profile.setLocation(request.getLocation());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());

        studentProfileRepository.save(profile);

        return mapToResponse(profile);
    }

    private StudentProfileResponse mapToResponse(StudentProfile profile) {

        User user = profile.getUser();

        return StudentProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .bio(profile.getBio())
                .university(profile.getUniversity())
                .college(profile.getCollege())
                .degree(profile.getDegree())
                .branch(profile.getBranch())
                .graduationYear(profile.getGraduationYear())
                .cgpa(profile.getCgpa())
                .location(profile.getLocation())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .resumeUrl(profile.getResumeUrl())
                .profileImageUrl(profile.getProfileImageUrl())
                .build();
    }
}