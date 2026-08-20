package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentNotificationPreference;
import com.hackhive.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentNotificationPreferenceRepository
        extends JpaRepository<StudentNotificationPreference, Long> {

    Optional<StudentNotificationPreference> findByStudentProfile(StudentProfile studentProfile);
}
