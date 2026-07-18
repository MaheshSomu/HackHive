package com.hackhive.event.mapper;

import com.hackhive.event.dto.response.EventRegistrationResponse;
import com.hackhive.event.dto.response.RegisteredStudentResponse;
import com.hackhive.event.entity.EventRegistration;
import org.springframework.stereotype.Component;

@Component
public class EventRegistrationMapper {

    public EventRegistrationResponse toResponse(
            EventRegistration registration) {

        return EventRegistrationResponse.builder()
                .registrationId(registration.getId())
                .eventId(registration.getEvent().getId())
                .eventTitle(registration.getEvent().getTitle())
                .studentProfileId(
                        registration.getStudentProfile().getId())
                .studentName(
                        registration.getStudentProfile()
                                .getUser()
                                .getFullName())
                .studentEmail(
                        registration.getStudentProfile()
                                .getUser()
                                .getEmail())
                .build();
    }

    public RegisteredStudentResponse toRegisteredStudentResponse(
            EventRegistration registration) {

        return RegisteredStudentResponse.builder()
                .registrationId(registration.getId())
                .studentProfileId(
                        registration.getStudentProfile().getId())
                .fullName(
                        registration.getStudentProfile()
                                .getUser()
                                .getFullName())
                .email(
                        registration.getStudentProfile()
                                .getUser()
                                .getEmail())
                .college(
                        registration.getStudentProfile()
                                .getCollege())
                .branch(
                        registration.getStudentProfile()
                                .getBranch())
                .graduationYear(
                        registration.getStudentProfile()
                                .getGraduationYear())
                .build();
    }
}