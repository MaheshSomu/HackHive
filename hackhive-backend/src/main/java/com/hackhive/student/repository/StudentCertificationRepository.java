package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentCertification;
import com.hackhive.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentCertificationRepository
        extends JpaRepository<StudentCertification, Long> {

    List<StudentCertification> findByStudentProfile(
            StudentProfile studentProfile
    );

    Optional<StudentCertification> findByIdAndStudentProfile(
            Long id,
            StudentProfile studentProfile
    );
}