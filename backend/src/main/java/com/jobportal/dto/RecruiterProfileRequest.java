package com.jobportal.dto;

import lombok.Data;

@Data
public class RecruiterProfileRequest {
    private String companyName;
    private String companyWebsite;
    private String companyAddress;
    private String designation;
    private String companyDescription;
}
