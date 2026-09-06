package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 4000, nullable = false)
    private String description;

    private String location;

    @Enumerated(EnumType.STRING)
    private JobType jobType;

    private Double minSalary;
    private Double maxSalary;

    @Column(length = 2000)
    private String requiredSkills; // comma separated

    private String experienceRequired;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;

    @Builder.Default
    private boolean active = true;

    private LocalDateTime postedAt;
    private LocalDateTime applicationDeadline;

    @PrePersist
    protected void onCreate() {
        this.postedAt = LocalDateTime.now();
    }
}
