package com.jobportal.dto;

import com.jobportal.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;

    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role; // JOB_SEEKER or RECRUITER (ADMIN created via seed data)

    // Optional, only used when role = RECRUITER
    private String companyName;
}
