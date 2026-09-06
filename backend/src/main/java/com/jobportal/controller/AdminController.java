package com.jobportal.controller;

import com.jobportal.dto.CategoryRequest;
import com.jobportal.entity.Category;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/jobseekers")
    public ResponseEntity<List<User>> getAllJobSeekers() {
        return ResponseEntity.ok(adminService.getAllJobSeekers());
    }

    @GetMapping("/recruiters")
    public ResponseEntity<List<User>> getAllRecruiters() {
        return ResponseEntity.ok(adminService.getAllRecruiters());
    }

    @GetMapping("/recruiters/pending")
    public ResponseEntity<List<User>> getPendingRecruiters() {
        return ResponseEntity.ok(adminService.getPendingRecruiters());
    }

    @PatchMapping("/recruiters/{id}/approve")
    public ResponseEntity<User> approveRecruiter(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveRecruiter(id));
    }

    @PatchMapping("/recruiters/{id}/reject")
    public ResponseEntity<User> rejectRecruiter(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectRecruiter(id));
    }

    @PatchMapping("/users/{id}/block")
    public ResponseEntity<User> blockUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.setBlockedStatus(id, true));
    }

    @PatchMapping("/users/{id}/unblock")
    public ResponseEntity<User> unblockUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.setBlockedStatus(id, false));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        adminService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(adminService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.ok(adminService.createCategory(request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
