package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentWorkspacePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentWorkspacePreferenceRepository
        extends JpaRepository<StudentWorkspacePreference, Long> {

    Optional<StudentWorkspacePreference> findByStudentProfile(StudentProfile studentProfile);
}
