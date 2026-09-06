package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.entity.Category;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobType;
import com.jobportal.entity.User;
import com.jobportal.repository.CategoryRepository;
import com.jobportal.repository.JobRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;

    public Job createJob(JobRequest request, User recruiter) {
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .requiredSkills(request.getRequiredSkills())
                .experienceRequired(request.getExperienceRequired())
                .applicationDeadline(request.getApplicationDeadline())
                .recruiter(recruiter)
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            job.setCategory(category);
        }

        return jobRepository.save(job);
    }

    public Job updateJob(Long jobId, JobRequest request, User recruiter) {
        Job job = getJobOwnedByRecruiter(jobId, recruiter);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setApplicationDeadline(request.getApplicationDeadline());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            job.setCategory(category);
        }

        return jobRepository.save(job);
    }

    public void deleteJob(Long jobId, User recruiter) {
        Job job = getJobOwnedByRecruiter(jobId, recruiter);
        jobRepository.delete(job);
    }

    public Job getJobOwnedByRecruiter(Long jobId, User recruiter) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new SecurityException("You do not own this job posting");
        }
        return job;
    }

    public List<Job> getJobsByRecruiter(User recruiter) {
        return jobRepository.findByRecruiter(recruiter);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public List<Job> searchJobs(String keyword, String location, Long categoryId, String jobType, Double minSalary) {
        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("requiredSkills")), like)
                ));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (jobType != null && !jobType.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("jobType"), JobType.valueOf(jobType)));
                } catch (IllegalArgumentException ignored) {
                    // Unknown job type filter value - skip this predicate
                }
            }
            if (minSalary != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("maxSalary"), minSalary));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return jobRepository.findAll(spec);
    }
}
