package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentSkillRepository
        extends JpaRepository<StudentSkill, Long> {

    List<StudentSkill> findByStudentProfile(StudentProfile studentProfile);

    Optional<StudentSkill> findByIdAndStudentProfile(
            Long id,
            StudentProfile studentProfile
    );
}