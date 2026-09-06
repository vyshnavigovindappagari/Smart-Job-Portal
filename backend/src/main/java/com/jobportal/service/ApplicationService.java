package com.jobportal.service;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final SavedJobRepository savedJobRepository;
    private final InterviewRepository interviewRepository;

    public JobApplication applyToJob(Long jobId, User applicant, String coverNote) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!job.isActive()) {
            throw new IllegalStateException("This job is no longer accepting applications");
        }

        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            throw new IllegalStateException("You have already applied to this job");
        }

        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(applicant.getId())
                .orElseThrow(() -> new IllegalStateException("Please complete your profile first"));

        if (profile.getResumePath() == null) {
            throw new IllegalStateException("Please upload a resume before applying");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .applicant(applicant)
                .status(ApplicationStatus.APPLIED)
                .resumeSnapshotPath(profile.getResumePath())
                .coverNote(coverNote)
                .build();

        return applicationRepository.save(application);
    }

    public List<JobApplication> getApplicationsByApplicant(User applicant) {
        return applicationRepository.findByApplicant(applicant);
    }

    public List<JobApplication> getApplicationsForJob(Long jobId, User recruiter) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You do not own this job posting");
        }
        return applicationRepository.findByJob(job);
    }

    public List<JobApplication> getAllApplicationsForRecruiter(User recruiter) {
        return applicationRepository.findByJobRecruiter(recruiter);
    }

    public JobApplication updateStatus(Long applicationId, ApplicationStatus status, User recruiter) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (!application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You do not have access to this application");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public SavedJob saveJob(Long jobId, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (savedJobRepository.existsByJobAndUser(job, user)) {
            throw new IllegalStateException("Job already saved");
        }

        SavedJob savedJob = SavedJob.builder().job(job).user(user).build();
        return savedJobRepository.save(savedJob);
    }

    public void unsaveJob(Long jobId, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        SavedJob savedJob = savedJobRepository.findByJobAndUser(job, user)
                .orElseThrow(() -> new IllegalArgumentException("Saved job not found"));
        savedJobRepository.delete(savedJob);
    }

    public List<SavedJob> getSavedJobs(User user) {
        return savedJobRepository.findByUser(user);
    }

    public Interview scheduleInterview(Long applicationId, Interview interviewDetails, User recruiter) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (!application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You do not have access to this application");
        }

        interviewDetails.setApplication(application);
        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(application);

        return interviewRepository.save(interviewDetails);
    }
}
