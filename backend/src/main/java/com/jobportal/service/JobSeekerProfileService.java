package com.jobportal.service;

import com.jobportal.dto.EducationRequest;
import com.jobportal.dto.ExperienceRequest;
import com.jobportal.dto.ProfileRequest;
import com.jobportal.entity.Education;
import com.jobportal.entity.Experience;
import com.jobportal.entity.JobSeekerProfile;
import com.jobportal.entity.User;
import com.jobportal.repository.JobSeekerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class JobSeekerProfileService {

    private final JobSeekerProfileRepository profileRepository;
    private final FileStorageService fileStorageService;

    public JobSeekerProfile getProfile(User user) {
        return profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Profile not found"));
    }

    public JobSeekerProfile updateProfile(User user, ProfileRequest request) {
        JobSeekerProfile profile = getProfile(user);
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setHeadline(request.getHeadline());
        profile.setAbout(request.getAbout());
        profile.setSkills(request.getSkills());
        return profileRepository.save(profile);
    }

    public JobSeekerProfile uploadResume(User user, MultipartFile file) {
        JobSeekerProfile profile = getProfile(user);
        String path = fileStorageService.storeResume(file, user.getId());
        profile.setResumeFileName(file.getOriginalFilename());
        profile.setResumePath(path);
        return profileRepository.save(profile);
    }

    public JobSeekerProfile addEducation(User user, EducationRequest request) {
        JobSeekerProfile profile = getProfile(user);
        Education education = Education.builder()
                .degree(request.getDegree())
                .institution(request.getInstitution())
                .fieldOfStudy(request.getFieldOfStudy())
                .startYear(request.getStartYear())
                .endYear(request.getEndYear())
                .grade(request.getGrade())
                .profile(profile)
                .build();
        profile.getEducation().add(education);
        return profileRepository.save(profile);
    }

    public void deleteEducation(User user, Long educationId) {
        JobSeekerProfile profile = getProfile(user);
        profile.getEducation().removeIf(e -> e.getId().equals(educationId));
        profileRepository.save(profile);
    }

    public JobSeekerProfile addExperience(User user, ExperienceRequest request) {
        JobSeekerProfile profile = getProfile(user);
        Experience experience = Experience.builder()
                .jobTitle(request.getJobTitle())
                .companyName(request.getCompanyName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .currentlyWorking(request.isCurrentlyWorking())
                .description(request.getDescription())
                .profile(profile)
                .build();
        profile.getExperience().add(experience);
        return profileRepository.save(profile);
    }

    public void deleteExperience(User user, Long experienceId) {
        JobSeekerProfile profile = getProfile(user);
        profile.getExperience().removeIf(e -> e.getId().equals(experienceId));
        profileRepository.save(profile);
    }
}
