package com.hackhive.submission.service;

import com.hackhive.submission.dto.request.CreateUpdateEvaluationRequest;
import com.hackhive.submission.dto.response.ProjectSubmissionEvaluationResponse;

public interface ProjectSubmissionEvaluationService {

    ProjectSubmissionEvaluationResponse saveEvaluationDraft(Long submissionId, CreateUpdateEvaluationRequest request);

    ProjectSubmissionEvaluationResponse getEvaluationBySubmissionId(Long submissionId);

    ProjectSubmissionEvaluationResponse updateEvaluationDraft(Long evaluationId, CreateUpdateEvaluationRequest request);

    ProjectSubmissionEvaluationResponse finalizeEvaluation(Long evaluationId);
}
