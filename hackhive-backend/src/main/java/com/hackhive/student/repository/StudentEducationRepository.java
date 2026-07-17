package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentEducation;
import com.hackhive.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentEducationRepository
        extends JpaRepository<StudentEducation, Long> {

    List<StudentEducation> findByStudentProfile(
            StudentProfile studentProfile
    );

    Optional<StudentEducation> findByIdAndStudentProfile(
            Long id,
            StudentProfile studentProfile
    );
}