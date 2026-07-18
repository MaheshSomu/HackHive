package com.hackhive.event.mapper;

import com.hackhive.event.dto.response.EventResponse;
import com.hackhive.event.entity.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public EventResponse toResponse(Event event) {

        return EventResponse.builder()
                .id(event.getId())
                .organizerId(
                        event.getOrganizerProfile().getId())
                .organizerName(
                        event.getOrganizerProfile()
                                .getOrganizationName())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .eventMode(event.getEventMode())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .registrationStartDate(
                        event.getRegistrationStartDate())
                .registrationEndDate(
                        event.getRegistrationEndDate())
                .minTeamSize(event.getMinTeamSize())
                .maxTeamSize(event.getMaxTeamSize())
                .eligibility(event.getEligibility())
                .bannerUrl(event.getBannerUrl())
                .collegeName(event.getCollegeName())
                .build();
    }
}