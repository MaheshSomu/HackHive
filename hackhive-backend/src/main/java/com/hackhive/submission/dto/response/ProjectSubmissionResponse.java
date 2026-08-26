package com.hackhive.submission.dto.response;

import com.hackhive.submission.enums.ProjectSubmissionStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSubmissionResponse {

    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long teamId;
    private String teamName;
    private Long submittedByStudentProfileId;
    private String submittedByName;
    private String projectTitle;
    private String problemStatement;
    private String projectDescription;
    private String technologiesUsed;
    private String githubUrl;
    private String demoUrl;
    private String presentationUrl;
    private ProjectSubmissionStatus submissionStatus;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
