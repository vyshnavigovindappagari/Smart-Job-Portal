import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);

  const load = async () => {
    const res = await api.get("/jobseeker/saved-jobs");
    setSavedJobs(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (jobId) => {
    await api.delete(`/jobseeker/jobs/${jobId}/save`);
    load();
  };

  return (
    <div className="page-container">
      <h2>Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <p>You haven't saved any jobs yet.</p>
      ) : (
        <div className="job-grid">
          {savedJobs.map((s) => (
            <div className="job-card" key={s.id}>
              <h3>{s.job.title}</h3>
              <p className="job-card-company">{s.job.location}</p>
              <div className="job-actions">
                <Link to={`/jobs/${s.job.id}`} className="btn-primary-sm">View</Link>
                <button className="btn-link" onClick={() => handleRemove(s.job.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
