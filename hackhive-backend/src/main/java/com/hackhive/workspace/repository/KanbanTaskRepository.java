package com.hackhive.workspace.repository;

import com.hackhive.student.entity.StudentProfile;
import com.hackhive.team.entity.Team;
import com.hackhive.workspace.entity.KanbanTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KanbanTaskRepository
        extends JpaRepository<KanbanTask, Long> {

    // Get all tasks belonging to a team
    List<KanbanTask> findByTeam(Team team);

    // Get tasks by team and status
    List<KanbanTask> findByTeamAndStatus(
            Team team,
            String status
    );

    // Get tasks assigned to a particular student
    List<KanbanTask> findByAssignedTo(
            StudentProfile assignedTo
    );

    // Get tasks assigned to a student within a specific team
    List<KanbanTask> findByTeamAndAssignedTo(
            Team team,
            StudentProfile assignedTo
    );
}