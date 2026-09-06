import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/public/jobs/${id}`).then((res) => setJob(res.data));
  }, [id]);

  const handleApply = async () => {
    setMessage("");
    try {
      await api.post(`/jobseeker/jobs/${id}/apply`, { coverNote });
      setMessage("Application submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply.");
    }
  };

  const handleSave = async () => {
    setMessage("");
    try {
      await api.post(`/jobseeker/jobs/${id}/save`);
      setMessage("Job saved to your list.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save job.");
    }
  };

  if (!job) return <div className="page-container"><p>Loading...</p></div>;

  return (
    <div className="page-container">
      <div className="job-details">
        <h2>{job.title}</h2>
        <p className="job-card-company">
          {job.recruiter?.fullName} &middot; {job.location || "Remote"}
        </p>
        {(job.minSalary || job.maxSalary) && (
          <p className="job-card-salary">₹{job.minSalary ?? "?"} - ₹{job.maxSalary ?? "?"} / year</p>
        )}
        {job.requiredSkills && <p><strong>Skills:</strong> {job.requiredSkills}</p>}
        {job.experienceRequired && <p><strong>Experience:</strong> {job.experienceRequired}</p>}
        <h3>Description</h3>
        <p style={{ whiteSpace: "pre-line" }}>{job.description}</p>

        {message && <p className="form-success">{message}</p>}

        {user && user.role === "JOB_SEEKER" && (
          <div className="job-actions">
            <textarea
              placeholder="Optional cover note to the recruiter"
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
            />
            <div>
              <button className="btn-primary" onClick={handleApply}>Apply Now</button>
              <button className="btn-secondary" onClick={handleSave}>Save Job</button>
            </div>
          </div>
        )}
        {!user && <p>Please <a href="/login">login</a> as a job seeker to apply.</p>}
      </div>
    </div>
  );
}
