import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const projectSubmissionEvaluationService = {
    getEvaluationBySubmissionId: (submissionId) =>
        request(api.get(`/project-submission-evaluations/submissions/${submissionId}`)),

    saveEvaluationDraft: (submissionId, data) =>
        request(api.post(`/project-submission-evaluations/submissions/${submissionId}`, data)),

    updateEvaluationDraft: (evaluationId, data) =>
        request(api.put(`/project-submission-evaluations/${evaluationId}`, data)),

    finalizeEvaluation: (evaluationId) =>
        request(api.post(`/project-submission-evaluations/${evaluationId}/finalize`)),
};

export default projectSubmissionEvaluationService;
