package com.hackhive.student.service;

import com.hackhive.student.dto.response.ResumeResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StudentResumeService {

    ResumeResponse uploadResume(MultipartFile file);

    ResumeResponse getMyResume();

    Resource downloadMyResumeResource();

    void deleteResume();
}