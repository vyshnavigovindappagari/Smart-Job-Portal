import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    api.get("/jobseeker/applications").then((res) => setApplications(res.data));
    api.get("/jobseeker/saved-jobs").then((res) => setSavedJobs(res.data));
  }, []);

  return (
    <div className="page-container">
      <h2>Welcome, {user.fullName}</h2>
      <div className="stats-row">
        <div className="stat-card">
          <h3>{applications.length}</h3>
          <p>Applications Submitted</p>
        </div>
        <div className="stat-card">
          <h3>{savedJobs.length}</h3>
          <p>Saved Jobs</p>
        </div>
      </div>

      <div className="dashboard-links">
        <Link to="/jobseeker/profile" className="btn-secondary">Edit Profile & Resume</Link>
        <Link to="/jobseeker/applications" className="btn-secondary">Track Applications</Link>
        <Link to="/jobseeker/saved-jobs" className="btn-secondary">Saved Jobs</Link>
        <Link to="/jobs" className="btn-primary">Browse New Jobs</Link>
      </div>

      <h3>Recent Applications</h3>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Job Title</th><th>Status</th><th>Applied On</th></tr>
          </thead>
          <tbody>
            {applications.slice(0, 5).map((a) => (
              <tr key={a.id}>
                <td>{a.job?.title}</td>
                <td><span className={`status-badge status-${a.status.toLowerCase()}`}>{a.status}</span></td>
                <td>{new Date(a.appliedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
