package com.hackhive.student.repository;

import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.entity.StudentSocialLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentSocialLinkRepository
        extends JpaRepository<StudentSocialLink, Long> {

    List<StudentSocialLink> findByStudentProfile(
            StudentProfile studentProfile
    );

    Optional<StudentSocialLink> findByIdAndStudentProfile(
            Long id,
            StudentProfile studentProfile
    );
}