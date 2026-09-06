import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-hero">
      <h1>Find Your Next Career Move</h1>
      <p>Search thousands of jobs, build your profile, and let recruiters find you.</p>
      <div className="home-actions">
        <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        <Link to="/register" className="btn-secondary">Get Started</Link>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>For Job Seekers</h3>
          <p>Build a profile, upload your resume, and apply to jobs in one click.</p>
        </div>
        <div className="feature-card">
          <h3>For Recruiters</h3>
          <p>Post jobs, review applicants, and schedule interviews with ease.</p>
        </div>
        <div className="feature-card">
          <h3>For Admins</h3>
          <p>Approve recruiters, manage categories, and monitor platform activity.</p>
        </div>
      </div>
    </div>
  );
}
