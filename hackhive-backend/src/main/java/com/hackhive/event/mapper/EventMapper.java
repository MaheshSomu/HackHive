package com.hackhive.event.mapper;

import com.hackhive.event.dto.response.EventResponse;
import com.hackhive.event.entity.Event;
import com.hackhive.event.enums.RegistrationType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class EventMapper {

    public EventResponse toResponse(Event event, Long registrationCount) {

        RegistrationType type = event.getRegistrationType() != null
                ? event.getRegistrationType()
                : RegistrationType.FREE;

        BigDecimal fee = event.getRegistrationFee() != null
                ? event.getRegistrationFee()
                : BigDecimal.ZERO;

        return EventResponse.builder()
                .id(event.getId())
                .organizerId(
                        event.getOrganizerProfile().getId())
                .organizerName(
                        event.getOrganizerProfile()
                                .getOrganizationName())
                .verified(
                        event.getOrganizerProfile() != null &&
                        Boolean.TRUE.equals(event.getOrganizerProfile().getVerified()))
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
                .registrationCount(registrationCount)
                .registrationType(type)
                .registrationFee(fee)
                .maxParticipants(event.getMaxParticipants())
                .build();
    }
}