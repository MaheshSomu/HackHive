package com.hackhive.student.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.dto.request.AddSkillRequest;
import com.hackhive.student.dto.request.UpdateSkillRequest;
import com.hackhive.student.dto.response.SkillResponse;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentSkill;
import com.hackhive.student.mapper.StudentSkillMapper;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.student.repository.StudentSkillRepository;
import com.hackhive.student.service.StudentSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentSkillServiceImpl implements StudentSkillService {

    private final StudentSkillRepository studentSkillRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentSkillMapper studentSkillMapper;

    private StudentProfile getCurrentStudentProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        return studentProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student profile not found."));
    }

    @Override
    public SkillResponse addSkill(AddSkillRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentSkill studentSkill = StudentSkill.builder()
                .studentProfile(profile)
                .skillName(request.getSkillName())
                .skillLevel(request.getSkillLevel())
                .build();

        studentSkill = studentSkillRepository.save(studentSkill);

        return studentSkillMapper.toResponse(studentSkill);
    }

    @Override
    public SkillResponse updateSkill(Long id,
                                    UpdateSkillRequest request) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentSkill studentSkill =
                studentSkillRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Skill not found."));

        studentSkill.setSkillName(request.getSkillName());
        studentSkill.setSkillLevel(request.getSkillLevel());

        studentSkill = studentSkillRepository.save(studentSkill);

        return studentSkillMapper.toResponse(studentSkill);
    }

    @Override
    public List<SkillResponse> getMySkills() {

        StudentProfile profile = getCurrentStudentProfile();

        return studentSkillRepository
                .findByStudentProfile(profile)
                .stream()
                .map(studentSkillMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteSkill(Long id) {

        StudentProfile profile = getCurrentStudentProfile();

        StudentSkill studentSkill =
                studentSkillRepository
                        .findByIdAndStudentProfile(id, profile)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Skill not found."));

        studentSkillRepository.delete(studentSkill);
    }
}