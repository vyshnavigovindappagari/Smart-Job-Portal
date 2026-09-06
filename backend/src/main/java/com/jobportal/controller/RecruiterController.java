package com.jobportal.controller;

import com.jobportal.dto.ApplicationStatusUpdateRequest;
import com.jobportal.dto.InterviewRequest;
import com.jobportal.dto.JobRequest;
import com.jobportal.dto.RecruiterProfileRequest;
import com.jobportal.entity.*;
import com.jobportal.security.CurrentUserProvider;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.JobService;
import com.jobportal.service.RecruiterProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final RecruiterProfileService recruiterProfileService;
    private final CurrentUserProvider currentUserProvider;

    private void assertApproved(User recruiter) {
        if (recruiter.getRecruiterStatus() != RecruiterStatus.APPROVED) {
            throw new SecurityException("Your recruiter account is pending admin approval");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfile> getProfile() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(recruiterProfileService.getProfile(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfile> updateProfile(@RequestBody RecruiterProfileRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(recruiterProfileService.updateProfile(user, request));
    }

    @PostMapping("/jobs")
    public ResponseEntity<Job> createJob(@Valid @RequestBody JobRequest request) {
        User user = currentUserProvider.getCurrentUser();
        assertApproved(user);
        return ResponseEntity.ok(jobService.createJob(request, user));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(jobService.updateJob(id, request, user));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        User user = currentUserProvider.getCurrentUser();
        jobService.deleteJob(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getMyJobs() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(jobService.getJobsByRecruiter(user));
    }

    @GetMapping("/jobs/{id}/applicants")
    public ResponseEntity<List<JobApplication>> getApplicants(@PathVariable Long id) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(applicationService.getApplicationsForJob(id, user));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(applicationService.getAllApplicationsForRecruiter(user));
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<JobApplication> updateApplicationStatus(@PathVariable Long id,
                                                                    @RequestBody ApplicationStatusUpdateRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(applicationService.updateStatus(id, request.getStatus(), user));
    }

    @PostMapping("/applications/{id}/interview")
    public ResponseEntity<Interview> scheduleInterview(@PathVariable Long id, @RequestBody InterviewRequest request) {
        User user = currentUserProvider.getCurrentUser();
        Interview interview = Interview.builder()
                .scheduledAt(request.getScheduledAt())
                .mode(request.getMode())
                .location(request.getLocation())
                .notes(request.getNotes())
                .build();
        return ResponseEntity.ok(applicationService.scheduleInterview(id, interview, user));
    }

    @GetMapping("/applications/{id}/resume")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {
        User user = currentUserProvider.getCurrentUser();
        List<JobApplication> applications = applicationService.getAllApplicationsForRecruiter(user);
        JobApplication application = applications.stream()
                .filter(a -> a.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new SecurityException("Application not found or access denied"));

        try {
            File file = new File(application.getResumeSnapshotPath());
            Resource resource = new UrlResource(file.toURI());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            throw new IllegalStateException("Resume file could not be read");
        }
    }
}
