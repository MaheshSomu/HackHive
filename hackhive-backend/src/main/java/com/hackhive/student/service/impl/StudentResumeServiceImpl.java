package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.common.service.FileStorageService;
import com.hackhive.student.dto.response.ResumeResponse;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.service.StudentResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class StudentResumeServiceImpl implements StudentResumeService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    private StudentProfile getCurrentStudentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found."));
    }

    @Override
    public ResumeResponse uploadResume(MultipartFile file) {
        StudentProfile profile = getCurrentStudentProfile();

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file is required.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed.");
        }

        // Delete existing resume before storing the new one
        if (profile.getResumeUrl() != null) {
            fileStorageService.deleteFile(profile.getResumeUrl());
        }

        String resumeUrl = fileStorageService.storeFile(file, "resumes");

        profile.setResumeUrl(resumeUrl);
        studentProfileRepository.save(profile);

        return ResumeResponse.builder()
                .resumeUrl(resumeUrl)
                .build();
    }

    @Override
    public ResumeResponse getMyResume() {
        StudentProfile profile = getCurrentStudentProfile();

        if (profile.getResumeUrl() == null) {
            throw new ResourceNotFoundException("Resume not found.");
        }

        return ResumeResponse.builder()
                .resumeUrl(profile.getResumeUrl())
                .build();
    }

    @Override
    public Resource downloadMyResumeResource() {
        StudentProfile profile = getCurrentStudentProfile();

        if (profile.getResumeUrl() == null) {
            throw new ResourceNotFoundException("Resume not found.");
        }

        String resumeUrl = profile.getResumeUrl();
        String subDirectory = "resumes";
        String filename = resumeUrl;

        if (resumeUrl.startsWith("uploads/resumes/")) {
            filename = resumeUrl.substring("uploads/resumes/".length());
        } else if (resumeUrl.startsWith("resumes/")) {
            filename = resumeUrl.substring("resumes/".length());
        } else if (resumeUrl.contains("/")) {
            filename = resumeUrl.substring(resumeUrl.lastIndexOf('/') + 1);
        }

        Resource resource = fileStorageService.loadFileAsResource(filename, subDirectory);
        if (resource == null) {
            throw new ResourceNotFoundException("Resume file not found.");
        }

        return resource;
    }

    @Override
    public void deleteResume() {
        StudentProfile profile = getCurrentStudentProfile();

        if (profile.getResumeUrl() == null) {
            throw new ResourceNotFoundException("Resource not found.");
        }

        fileStorageService.deleteFile(profile.getResumeUrl());

        profile.setResumeUrl(null);
        studentProfileRepository.save(profile);
    }
}