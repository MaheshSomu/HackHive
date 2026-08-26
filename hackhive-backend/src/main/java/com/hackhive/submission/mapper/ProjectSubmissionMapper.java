package com.hackhive.submission.mapper;

import com.hackhive.submission.dto.response.ProjectSubmissionResponse;
import com.hackhive.submission.entity.ProjectSubmission;
import org.springframework.stereotype.Component;

@Component
public class ProjectSubmissionMapper {

    public ProjectSubmissionResponse toResponse(ProjectSubmission submission) {
        if (submission == null) {
            return null;
        }

        String submittedByName = null;
        if (submission.getSubmittedBy() != null && submission.getSubmittedBy().getUser() != null) {
            submittedByName = submission.getSubmittedBy().getUser().getFullName();
        }

        return ProjectSubmissionResponse.builder()
                .id(submission.getId())
                .eventId(submission.getEvent() != null ? submission.getEvent().getId() : null)
                .eventTitle(submission.getEvent() != null ? submission.getEvent().getTitle() : null)
                .teamId(submission.getTeam() != null ? submission.getTeam().getId() : null)
                .teamName(submission.getTeam() != null ? submission.getTeam().getName() : null)
                .submittedByStudentProfileId(submission.getSubmittedBy() != null ? submission.getSubmittedBy().getId() : null)
                .submittedByName(submittedByName)
                .projectTitle(submission.getProjectTitle())
                .problemStatement(submission.getProblemStatement())
                .projectDescription(submission.getProjectDescription())
                .technologiesUsed(submission.getTechnologiesUsed())
                .githubUrl(submission.getGithubUrl())
                .demoUrl(submission.getDemoUrl())
                .presentationUrl(submission.getPresentationUrl())
                .submissionStatus(submission.getSubmissionStatus())
                .submittedAt(submission.getSubmittedAt())
                .createdAt(submission.getCreatedAt())
                .updatedAt(submission.getUpdatedAt())
                .build();
    }
}
