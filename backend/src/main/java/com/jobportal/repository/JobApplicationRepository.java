package com.jobportal.repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicant(User applicant);
    List<JobApplication> findByJob(Job job);
    List<JobApplication> findByJobRecruiter(User recruiter);
    Optional<JobApplication> findByJobAndApplicant(Job job, User applicant);
    boolean existsByJobAndApplicant(Job job, User applicant);
}
