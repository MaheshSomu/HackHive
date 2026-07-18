package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.AddSocialLinkRequest;
import com.hackhive.student.dto.request.UpdateSocialLinkRequest;
import com.hackhive.student.dto.response.SocialLinkResponse;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentSocialLink;
import com.hackhive.student.mapper.StudentSocialLinkMapper;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.repository.StudentSocialLinkRepository;
import com.hackhive.student.service.StudentSocialLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentSocialLinkServiceImpl
        implements StudentSocialLinkService {

    private final StudentSocialLinkRepository studentSocialLinkRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentSocialLinkMapper studentSocialLinkMapper;

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
    public SocialLinkResponse addSocialLink(
            AddSocialLinkRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentSocialLink socialLink =
                StudentSocialLink.builder()
                        .studentProfile(profile)
                        .platform(request.getPlatform())
                        .url(request.getUrl())
                        .build();

        socialLink =
                studentSocialLinkRepository.save(socialLink);

        return studentSocialLinkMapper.toResponse(socialLink);
    }

    @Override
    public List<SocialLinkResponse> getMySocialLinks() {

        StudentProfile profile = getCurrentStudentProfile();

        return studentSocialLinkRepository
                .findByStudentProfile(profile)
                .stream()
                .map(studentSocialLinkMapper::toResponse)
                .toList();
    }

    @Override
    public SocialLinkResponse updateSocialLink(
            Long id,
            UpdateSocialLinkRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentSocialLink socialLink =
                studentSocialLinkRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Social link not found."));

        socialLink.setPlatform(request.getPlatform());
        socialLink.setUrl(request.getUrl());

        socialLink =
                studentSocialLinkRepository.save(socialLink);

        return studentSocialLinkMapper.toResponse(socialLink);
    }

    @Override
    public void deleteSocialLink(Long id) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentSocialLink socialLink =
                studentSocialLinkRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Social link not found."));

        studentSocialLinkRepository.delete(socialLink);
    }
}