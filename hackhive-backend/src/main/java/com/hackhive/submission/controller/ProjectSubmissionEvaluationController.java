package com.hackhive.submission.controller;

import com.hackhive.common.response.ApiResponse;
import com.hackhive.submission.dto.request.CreateUpdateEvaluationRequest;
import com.hackhive.submission.dto.response.ProjectSubmissionEvaluationResponse;
import com.hackhive.submission.service.ProjectSubmissionEvaluationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/project-submission-evaluations")
@RequiredArgsConstructor
@Tag(name = "Project Submission Evaluation", description = "Endpoints for event organizers to review and evaluate project submissions")
public class ProjectSubmissionEvaluationController {

    private final ProjectSubmissionEvaluationService evaluationService;

    @PostMapping("/submissions/{submissionId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Save evaluation draft", description = "Creates or saves a draft evaluation for a project submission.")
    public ResponseEntity<ApiResponse<ProjectSubmissionEvaluationResponse>> saveEvaluationDraft(
            @PathVariable Long submissionId,
            @Valid @RequestBody CreateUpdateEvaluationRequest request) {

        ProjectSubmissionEvaluationResponse response = evaluationService.saveEvaluationDraft(submissionId, request);

        return ResponseEntity.ok(
                ApiResponse.<ProjectSubmissionEvaluationResponse>builder()
                        .success(true)
                        .message("Project evaluation draft saved successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/submissions/{submissionId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Get evaluation by submission ID", description = "Retrieves the evaluation for a specified project submission ID.")
    public ResponseEntity<ApiResponse<ProjectSubmissionEvaluationResponse>> getEvaluationBySubmissionId(
            @PathVariable Long submissionId) {

        ProjectSubmissionEvaluationResponse response = evaluationService.getEvaluationBySubmissionId(submissionId);

        return ResponseEntity.ok(
                ApiResponse.<ProjectSubmissionEvaluationResponse>builder()
                        .success(true)
                        .message("Project evaluation retrieved successfully.")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{evaluationId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Update draft evaluation", description = "Updates an existing draft evaluation for a project submission.")
    public ResponseEntity<ApiResponse<ProjectSubmissionEvaluationResponse>> updateEvaluationDraft(
            @PathVariable Long evaluationId,
            @Valid @RequestBody CreateUpdateEvaluationRequest request) {

        ProjectSubmissionEvaluationResponse response = evaluationService.updateEvaluationDraft(evaluationId, request);

        return ResponseEntity.ok(
                ApiResponse.<ProjectSubmissionEvaluationResponse>builder()
                        .success(true)
                        .message("Project evaluation updated successfully.")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/{evaluationId}/finalize")
    @PreAuthorize("hasRole('ORGANIZER')")
    @Operation(summary = "Finalize evaluation", description = "Finalizes the project evaluation. Finalized evaluations become immutable.")
    public ResponseEntity<ApiResponse<ProjectSubmissionEvaluationResponse>> finalizeEvaluation(
            @PathVariable Long evaluationId) {

        ProjectSubmissionEvaluationResponse response = evaluationService.finalizeEvaluation(evaluationId);

        return ResponseEntity.ok(
                ApiResponse.<ProjectSubmissionEvaluationResponse>builder()
                        .success(true)
                        .message("Project evaluation finalized successfully.")
                        .data(response)
                        .build()
        );
    }
}
