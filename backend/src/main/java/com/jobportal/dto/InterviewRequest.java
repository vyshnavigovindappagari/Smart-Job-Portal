package com.jobportal.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewRequest {
    private LocalDateTime scheduledAt;
    private String mode;
    private String location;
    private String notes;
}
