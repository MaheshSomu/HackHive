package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentExperience;
import com.hackhive.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentExperienceRepository
        extends JpaRepository<StudentExperience, Long> {

    List<StudentExperience> findByStudentProfile(
            StudentProfile studentProfile
    );

    Optional<StudentExperience> findByIdAndStudentProfile(
            Long id,
            StudentProfile studentProfile
    );
}