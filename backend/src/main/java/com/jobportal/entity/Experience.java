package com.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "experience")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;
    private String companyName;
    private String startDate;
    private String endDate;
    private boolean currentlyWorking;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    @JsonIgnore
    private JobSeekerProfile profile;
}
