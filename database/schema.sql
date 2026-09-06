-- ============================================================
-- Smart Job Portal & Recruitment Management System
-- Reference schema (Spring Data JPA will auto-create/update
-- these tables via `spring.jpa.hibernate.ddl-auto=update`,
-- this file is provided for reference / manual setup).
-- ============================================================

CREATE DATABASE IF NOT EXISTS job_portal_db;
USE job_portal_db;

-- ---------------- Users ----------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('JOB_SEEKER','RECRUITER','ADMIN') NOT NULL,
    recruiter_status ENUM('PENDING','APPROVED','REJECTED'),
    blocked BOOLEAN DEFAULT FALSE,
    created_at DATETIME
);

-- ---------------- Job Seeker Profile ----------------
CREATE TABLE IF NOT EXISTS job_seeker_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(255),
    headline VARCHAR(255),
    about TEXT,
    skills VARCHAR(1000),
    resume_file_name VARCHAR(255),
    resume_path VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS education (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    degree VARCHAR(255),
    institution VARCHAR(255),
    field_of_study VARCHAR(255),
    start_year VARCHAR(20),
    end_year VARCHAR(20),
    grade VARCHAR(50),
    profile_id BIGINT,
    FOREIGN KEY (profile_id) REFERENCES job_seeker_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS experience (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    currently_working BOOLEAN DEFAULT FALSE,
    description TEXT,
    profile_id BIGINT,
    FOREIGN KEY (profile_id) REFERENCES job_seeker_profiles(id) ON DELETE CASCADE
);

-- ---------------- Recruiter Profile ----------------
CREATE TABLE IF NOT EXISTS recruiter_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(255),
    company_website VARCHAR(255),
    company_address VARCHAR(255),
    designation VARCHAR(255),
    company_description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------- Categories ----------------
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500)
);

-- ---------------- Jobs ----------------
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    job_type ENUM('FULL_TIME','PART_TIME','INTERNSHIP','CONTRACT','REMOTE'),
    min_salary DOUBLE,
    max_salary DOUBLE,
    required_skills VARCHAR(2000),
    experience_required VARCHAR(100),
    category_id BIGINT,
    recruiter_id BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    posted_at DATETIME,
    application_deadline DATETIME,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------- Job Applications ----------------
CREATE TABLE IF NOT EXISTS job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    status ENUM('APPLIED','SHORTLISTED','INTERVIEW_SCHEDULED','REJECTED','HIRED') DEFAULT 'APPLIED',
    resume_snapshot_path VARCHAR(500),
    cover_note VARCHAR(1000),
    applied_at DATETIME,
    UNIQUE KEY uq_job_applicant (job_id, applicant_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------- Saved Jobs ----------------
CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    saved_at DATETIME,
    UNIQUE KEY uq_job_user (job_id, user_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------- Interviews ----------------
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    scheduled_at DATETIME,
    mode VARCHAR(50),
    location VARCHAR(255),
    notes VARCHAR(1000),
    created_at DATETIME,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);

-- ---------------- Seed data ----------------
-- Default admin: admin@jobportal.com / Admin@123 (auto-created by the backend's DataSeeder)

INSERT IGNORE INTO categories (name) VALUES
 ('Information Technology'), ('Marketing'), ('Sales'), ('Finance'),
 ('Human Resources'), ('Design'), ('Customer Support'), ('Engineering');
