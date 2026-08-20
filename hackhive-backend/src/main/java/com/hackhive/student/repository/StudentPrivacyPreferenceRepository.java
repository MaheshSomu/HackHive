package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentPrivacyPreference;
import com.hackhive.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentPrivacyPreferenceRepository
        extends JpaRepository<StudentPrivacyPreference, Long> {

    Optional<StudentPrivacyPreference> findByStudentProfile(StudentProfile studentProfile);
}
