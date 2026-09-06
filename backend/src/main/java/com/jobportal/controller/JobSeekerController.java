package com.jobportal.controller;

import com.jobportal.dto.EducationRequest;
import com.jobportal.dto.ExperienceRequest;
import com.jobportal.dto.ProfileRequest;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.JobSeekerProfile;
import com.jobportal.entity.SavedJob;
import com.jobportal.entity.User;
import com.jobportal.security.CurrentUserProvider;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.JobSeekerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobseeker")
@RequiredArgsConstructor
public class JobSeekerController {

    private final JobSeekerProfileService profileService;
    private final ApplicationService applicationService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/profile")
    public ResponseEntity<JobSeekerProfile> getProfile() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(profileService.getProfile(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<JobSeekerProfile> updateProfile(@RequestBody ProfileRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(profileService.updateProfile(user, request));
    }

    @PostMapping("/profile/resume")
    public ResponseEntity<JobSeekerProfile> uploadResume(@RequestParam("file") MultipartFile file) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(profileService.uploadResume(user, file));
    }

    @PostMapping("/profile/education")
    public ResponseEntity<JobSeekerProfile> addEducation(@RequestBody EducationRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(profileService.addEducation(user, request));
    }

    @DeleteMapping("/profile/education/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        User user = currentUserProvider.getCurrentUser();
        profileService.deleteEducation(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/profile/experience")
    public ResponseEntity<JobSeekerProfile> addExperience(@RequestBody ExperienceRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(profileService.addExperience(user, request));
    }

    @DeleteMapping("/profile/experience/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        User user = currentUserProvider.getCurrentUser();
        profileService.deleteExperience(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<JobApplication> applyToJob(@PathVariable Long jobId, @RequestBody(required = false) Map<String, String> body) {
        User user = currentUserProvider.getCurrentUser();
        String coverNote = body != null ? body.get("coverNote") : null;
        return ResponseEntity.ok(applicationService.applyToJob(jobId, user, coverNote));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getMyApplications() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(applicationService.getApplicationsByApplicant(user));
    }

    @PostMapping("/jobs/{jobId}/save")
    public ResponseEntity<SavedJob> saveJob(@PathVariable Long jobId) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(applicationService.saveJob(jobId, user));
    }

    @DeleteMapping("/jobs/{jobId}/save")
    public ResponseEntity<Void> unsaveJob(@PathVariable Long jobId) {
        User user = currentUserProvider.getCurrentUser();
        applicationService.unsaveJob(jobId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<List<SavedJob>> getSavedJobs() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(applicationService.getSavedJobs(user));
    }
}
