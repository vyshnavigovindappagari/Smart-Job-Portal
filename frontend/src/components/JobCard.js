import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p className="job-card-company">
        {job.recruiter ? job.recruiter.fullName : "Company"} &middot; {job.location || "Remote"}
      </p>
      <p className="job-card-meta">
        {job.jobType && <span className="badge">{job.jobType.replace("_", " ")}</span>}
        {job.category && <span className="badge">{job.category.name}</span>}
      </p>
      {(job.minSalary || job.maxSalary) && (
        <p className="job-card-salary">
          ₹{job.minSalary ?? "?"} - ₹{job.maxSalary ?? "?"} / year
        </p>
      )}
      <p className="job-card-desc">
        {job.description?.slice(0, 140)}
        {job.description?.length > 140 ? "..." : ""}
      </p>
      <Link to={`/jobs/${job.id}`} className="btn-primary-sm">
        View Details
      </Link>
    </div>
  );
}
