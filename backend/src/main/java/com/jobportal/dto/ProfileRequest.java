package com.jobportal.dto;

import lombok.Data;

@Data
public class ProfileRequest {
    private String phone;
    private String address;
    private String headline;
    private String about;
    private String skills; // comma separated
}
