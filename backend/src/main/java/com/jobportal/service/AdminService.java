package com.jobportal.service;

import com.jobportal.dto.CategoryRequest;
import com.jobportal.entity.*;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final CategoryRepository categoryRepository;

    public List<User> getAllJobSeekers() {
        return userRepository.findByRole(Role.JOB_SEEKER);
    }

    public List<User> getAllRecruiters() {
        return userRepository.findByRole(Role.RECRUITER);
    }

    public List<User> getPendingRecruiters() {
        return userRepository.findByRole(Role.RECRUITER).stream()
                .filter(u -> u.getRecruiterStatus() == RecruiterStatus.PENDING)
                .toList();
    }

    public User approveRecruiter(Long userId) {
        User user = getRecruiterOrThrow(userId);
        user.setRecruiterStatus(RecruiterStatus.APPROVED);
        return userRepository.save(user);
    }

    public User rejectRecruiter(Long userId) {
        User user = getRecruiterOrThrow(userId);
        user.setRecruiterStatus(RecruiterStatus.REJECTED);
        return userRepository.save(user);
    }

    private User getRecruiterOrThrow(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() != Role.RECRUITER) {
            throw new IllegalArgumentException("User is not a recruiter");
        }
        return user;
    }

    public User setBlockedStatus(Long userId, boolean blocked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setBlocked(blocked);
        return userRepository.save(user);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }

    public Category createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobSeekers", userRepository.findByRole(Role.JOB_SEEKER).size());
        stats.put("totalRecruiters", userRepository.findByRole(Role.RECRUITER).size());
        stats.put("pendingRecruiters", getPendingRecruiters().size());
        stats.put("totalJobs", jobRepository.count());
        stats.put("activeJobs", jobRepository.findByActiveTrue().size());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        return stats;
    }
}
