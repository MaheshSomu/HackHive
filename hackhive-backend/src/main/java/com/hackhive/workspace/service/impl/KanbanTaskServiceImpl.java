package com.hackhive.workspace.service.impl;

import com.hackhive.auth.entity.User;
import com.hackhive.auth.repository.UserRepository;
import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.exception.ResourceNotFoundException;
import com.hackhive.student.entity.StudentProfile;
import com.hackhive.student.repository.StudentProfileRepository;
import com.hackhive.team.entity.Team;
import com.hackhive.team.repository.TeamMemberRepository;
import com.hackhive.team.repository.TeamRepository;
import com.hackhive.workspace.dto.request.CreateKanbanTaskRequest;
import com.hackhive.workspace.dto.request.UpdateKanbanTaskRequest;
import com.hackhive.workspace.dto.response.KanbanTaskResponse;
import com.hackhive.workspace.entity.KanbanTask;
import com.hackhive.workspace.mapper.KanbanTaskMapper;
import com.hackhive.workspace.repository.KanbanTaskRepository;
import com.hackhive.workspace.service.KanbanTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class KanbanTaskServiceImpl
        implements KanbanTaskService {

    private final KanbanTaskRepository kanbanTaskRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final KanbanTaskMapper kanbanTaskMapper;

    private static final Set<String> VALID_STATUSES =
            Set.of(
                    "TODO",
                    "IN_PROGRESS",
                    "DONE"
            );

    private static final Set<String> VALID_PRIORITIES =
            Set.of(
                    "LOW",
                    "MEDIUM",
                    "HIGH"
            );

    private StudentProfile getCurrentStudentProfile() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));

        return studentProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found."
                        ));
    }

    private Team getTeam(Long teamId) {

        return teamRepository
                .findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found."
                        ));
    }

    private void validateTeamMember(
            Team team,
            StudentProfile studentProfile) {

        boolean isMember =
                teamMemberRepository
                        .existsByTeamAndStudentProfile(
                                team,
                                studentProfile
                        );

        if (!isMember) {
            throw new BadRequestException(
                    "You are not a member of this team."
            );
        }
    }

    private void validateStatus(String status) {

        if (status == null) {
            return;
        }

        if (!VALID_STATUSES.contains(
                status.toUpperCase())) {

            throw new BadRequestException(
                    "Invalid task status. "
                            + "Allowed values: TODO, "
                            + "IN_PROGRESS, DONE."
            );
        }
    }

    private void validatePriority(String priority) {

        if (priority == null) {
            return;
        }

        if (!VALID_PRIORITIES.contains(
                priority.toUpperCase())) {

            throw new BadRequestException(
                    "Invalid task priority. "
                            + "Allowed values: LOW, "
                            + "MEDIUM, HIGH."
            );
        }
    }

    private StudentProfile getAssignedStudent(
            Long studentProfileId,
            Team team) {

        if (studentProfileId == null) {
            return null;
        }

        StudentProfile studentProfile =
                studentProfileRepository
                        .findById(studentProfileId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assigned student profile not found."
                                ));

        validateTeamMember(
                team,
                studentProfile
        );

        return studentProfile;
    }

    @Override
    @Transactional
    public KanbanTaskResponse createTask(
            CreateKanbanTaskRequest request) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team =
                getTeam(request.getTeamId());

        validateTeamMember(
                team,
                currentStudent
        );

        validateStatus(request.getStatus());
        validatePriority(request.getPriority());

        StudentProfile assignedStudent =
                getAssignedStudent(
                        request.getAssignedToStudentProfileId(),
                        team
                );

        String status =
                request.getStatus() == null
                        ? "TODO"
                        : request.getStatus().toUpperCase();

        String priority =
                request.getPriority() == null
                        ? "MEDIUM"
                        : request.getPriority().toUpperCase();

        KanbanTask task =
                KanbanTask.builder()
                        .team(team)
                        .title(request.getTitle())
                        .description(request.getDescription())
                        .assignedTo(assignedStudent)
                        .status(status)
                        .priority(priority)
                        .dueDate(request.getDueDate())
                        .build();

        task = kanbanTaskRepository.save(task);

        return kanbanTaskMapper.toResponse(task);
    }

    @Override
    public KanbanTaskResponse getTaskById(
            Long taskId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        KanbanTask task =
                kanbanTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Task not found."
                                ));

        validateTeamMember(
                task.getTeam(),
                currentStudent
        );

        return kanbanTaskMapper.toResponse(task);
    }

    @Override
    public List<KanbanTaskResponse> getTeamTasks(
            Long teamId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team = getTeam(teamId);

        validateTeamMember(
                team,
                currentStudent
        );

        return kanbanTaskRepository
                .findByTeam(team)
                .stream()
                .map(kanbanTaskMapper::toResponse)
                .toList();
    }

    @Override
    public List<KanbanTaskResponse> getTeamTasksByStatus(
            Long teamId,
            String status) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        Team team = getTeam(teamId);

        validateTeamMember(
                team,
                currentStudent
        );

        validateStatus(status);

        return kanbanTaskRepository
                .findByTeamAndStatus(
                        team,
                        status.toUpperCase()
                )
                .stream()
                .map(kanbanTaskMapper::toResponse)
                .toList();
    }

    @Override
    public List<KanbanTaskResponse> getMyTasks() {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        return kanbanTaskRepository
                .findByAssignedTo(currentStudent)
                .stream()
                .map(kanbanTaskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public KanbanTaskResponse updateTask(
            Long taskId,
            UpdateKanbanTaskRequest request) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        KanbanTask task =
                kanbanTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Task not found."
                                ));

        Team team = task.getTeam();

        validateTeamMember(
                team,
                currentStudent
        );

        validateStatus(request.getStatus());
        validatePriority(request.getPriority());

        StudentProfile assignedStudent =
                getAssignedStudent(
                        request.getAssignedToStudentProfileId(),
                        team
                );

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setAssignedTo(assignedStudent);
        task.setDueDate(request.getDueDate());

        if (request.getStatus() != null) {
            task.setStatus(
                    request.getStatus().toUpperCase()
            );
        }

        if (request.getPriority() != null) {
            task.setPriority(
                    request.getPriority().toUpperCase()
            );
        }

        task = kanbanTaskRepository.save(task);

        return kanbanTaskMapper.toResponse(task);
    }

    @Override
    @Transactional
    public void deleteTask(Long taskId) {

        StudentProfile currentStudent =
                getCurrentStudentProfile();

        KanbanTask task =
                kanbanTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Task not found."
                                ));

        validateTeamMember(
                task.getTeam(),
                currentStudent
        );

        kanbanTaskRepository.delete(task);
    }
}