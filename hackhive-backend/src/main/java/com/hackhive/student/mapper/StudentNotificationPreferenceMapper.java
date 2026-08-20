package com.hackhive.student.mapper;

import com.hackhive.student.dto.response.StudentNotificationPreferenceResponse;
import com.hackhive.student.entity.StudentNotificationPreference;
import org.springframework.stereotype.Component;

@Component
public class StudentNotificationPreferenceMapper {

    public StudentNotificationPreferenceResponse toResponse(StudentNotificationPreference preference) {
        if (preference == null) {
            return null;
        }

        return StudentNotificationPreferenceResponse.builder()
                .eventRegistrationUpdates(preference.getEventRegistrationUpdates())
                .eventReminders(preference.getEventReminders())
                .submissionDeadlineReminders(preference.getSubmissionDeadlineReminders())
                .teamInvitations(preference.getTeamInvitations())
                .teamActivity(preference.getTeamActivity())
                .hackathonAnnouncements(preference.getHackathonAnnouncements())
                .weeklyRecommendations(preference.getWeeklyRecommendations())
                .build();
    }
}
