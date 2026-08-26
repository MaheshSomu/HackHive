package com.hackhive.submission.service;

import com.hackhive.submission.dto.request.ConfigureProjectResultRequest;
import com.hackhive.submission.dto.request.UpdateProjectResultRequest;
import com.hackhive.submission.dto.response.ProjectResultResponse;

import java.util.List;

public interface ProjectResultService {

    ProjectResultResponse configureResult(Long eventId, ConfigureProjectResultRequest request);

    List<ProjectResultResponse> getEventLeaderboardForOrganizer(Long eventId);

    ProjectResultResponse updateResult(Long resultId, UpdateProjectResultRequest request);

    ProjectResultResponse publishResult(Long resultId);

    List<ProjectResultResponse> publishAllResultsForEvent(Long eventId);

    List<ProjectResultResponse> getPublishedResultsForEvent(Long eventId);

    ProjectResultResponse getPublishedResultForTeam(Long teamId);
}
