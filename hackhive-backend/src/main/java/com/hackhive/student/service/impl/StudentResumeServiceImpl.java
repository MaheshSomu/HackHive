package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.response.ResumeResponse;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.service.StudentResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentResumeServiceImpl
        implements StudentResumeService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/resumes";

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
    public ResumeResponse uploadResume(MultipartFile file) {

        StudentProfile profile = getCurrentStudentProfile();

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Resume file is required.");
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.toLowerCase().endsWith(".pdf")) {

            throw new IllegalArgumentException(
                    "Only PDF files are allowed.");
        }

        try {

            Path uploadPath = Paths.get(UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Delete existing resume before storing the new one
            if (profile.getResumeUrl() != null) {

                Path oldResumePath =
                        Paths.get(profile.getResumeUrl());

                Files.deleteIfExists(oldResumePath);
            }

            String fileName =
                    UUID.randomUUID() + ".pdf";

            Path filePath =
                    uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            String resumeUrl =
                    filePath.toString().replace("\\", "/");

            profile.setResumeUrl(resumeUrl);

            studentProfileRepository.save(profile);

            return ResumeResponse.builder()
                    .resumeUrl(resumeUrl)
                    .build();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload resume.", e);
        }
    }

    @Override
    public ResumeResponse getMyResume() {

        StudentProfile profile = getCurrentStudentProfile();

        if (profile.getResumeUrl() == null) {
            throw new ResourceNotFoundException(
                    "Resume not found.");
        }

        return ResumeResponse.builder()
                .resumeUrl(profile.getResumeUrl())
                .build();
    }

    @Override
    public void deleteResume() {

        StudentProfile profile = getCurrentStudentProfile();

        if (profile.getResumeUrl() == null) {
            throw new ResourceNotFoundException(
                    "Resume not found.");
        }

        try {

            Path resumePath =
                    Paths.get(profile.getResumeUrl());

            Files.deleteIfExists(resumePath);

            profile.setResumeUrl(null);

            studentProfileRepository.save(profile);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to delete resume.", e);
        }
    }
}