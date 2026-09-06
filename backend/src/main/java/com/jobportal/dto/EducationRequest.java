package com.jobportal.dto;

import lombok.Data;

@Data
public class EducationRequest {
    private String degree;
    private String institution;
    private String fieldOfStudy;
    private String startYear;
    private String endYear;
    private String grade;
}
