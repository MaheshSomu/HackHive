package com.hackhive.team.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalEventResponse {

    private Long id;
    private String eventName;
    private String organizerName;
    private String eventDate;
    private String description;
}
