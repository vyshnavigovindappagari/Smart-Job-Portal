package com.jobportal.dto;

import lombok.Data;

@Data
public class ExperienceRequest {
    private String jobTitle;
    private String companyName;
    private String startDate;
    private String endDate;
    private boolean currentlyWorking;
    private String description;
}
