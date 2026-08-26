package com.hackhive.submission.service;

import com.hackhive.submission.dto.request.CreateProjectSubmissionRequest;
import com.hackhive.submission.dto.request.UpdateProjectSubmissionRequest;
import com.hackhive.submission.dto.response.ProjectSubmissionResponse;

import java.util.List;

public interface ProjectSubmissionService {

    ProjectSubmissionResponse createDraft(CreateProjectSubmissionRequest request);

    ProjectSubmissionResponse getSubmissionByTeam(Long teamId);

    ProjectSubmissionResponse updateDraft(Long submissionId, UpdateProjectSubmissionRequest request);

    ProjectSubmissionResponse submitProject(Long submissionId);

    List<ProjectSubmissionResponse> getEventSubmissionsForOrganizer(Long eventId);
}
