package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProjectRepository
        extends JpaRepository<StudentProject, Long> {

    List<StudentProject> findByStudentProfile(
            StudentProfile studentProfile
    );

    Optional<StudentProject> findByIdAndStudentProfile(
            Long id,
            StudentProfile studentProfile
    );
}