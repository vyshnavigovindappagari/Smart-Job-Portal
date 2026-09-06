package com.jobportal.dto;

import com.jobportal.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String location;
    private JobType jobType;
    private Double minSalary;
    private Double maxSalary;
    private String requiredSkills;
    private String experienceRequired;
    private Long categoryId;
    private LocalDateTime applicationDeadline;
}
