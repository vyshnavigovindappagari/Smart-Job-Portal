package com.jobportal.service;

import com.jobportal.dto.RecruiterProfileRequest;
import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.User;
import com.jobportal.repository.RecruiterProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecruiterProfileService {

    private final RecruiterProfileRepository recruiterProfileRepository;

    public RecruiterProfile getProfile(User user) {
        return recruiterProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Company profile not found"));
    }

    public RecruiterProfile updateProfile(User user, RecruiterProfileRequest request) {
        RecruiterProfile profile = getProfile(user);
        profile.setCompanyName(request.getCompanyName());
        profile.setCompanyWebsite(request.getCompanyWebsite());
        profile.setCompanyAddress(request.getCompanyAddress());
        profile.setDesignation(request.getDesignation());
        profile.setCompanyDescription(request.getCompanyDescription());
        return recruiterProfileRepository.save(profile);
    }
}
