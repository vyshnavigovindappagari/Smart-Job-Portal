import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/recruiter/jobs").then((res) => setJobs(res.data));
    api.get("/recruiter/applications").then((res) => setApplications(res.data)).catch(() => setApplications([]));
  }, []);

  const isPending = user.recruiterStatus === "PENDING";
  const isRejected = user.recruiterStatus === "REJECTED";

  return (
    <div className="page-container">
      <h2>Recruiter Dashboard</h2>

      {isPending && (
        <div className="alert-warning">
          Your recruiter account is pending admin approval. You'll be able to post jobs once approved.
        </div>
      )}
      {isRejected && (
        <div className="alert-error">
          Your recruiter account was not approved. Please contact support.
        </div>
      )}

      <div className="stats-row">
        <div className="stat-card"><h3>{jobs.length}</h3><p>Jobs Posted</p></div>
        <div className="stat-card"><h3>{applications.length}</h3><p>Total Applicants</p></div>
      </div>

      <div className="dashboard-links">
        <Link to="/recruiter/profile" className="btn-secondary">Company Profile</Link>
        <Link to="/recruiter/jobs" className="btn-secondary">Manage Jobs</Link>
        <Link to="/recruiter/post-job" className="btn-primary">+ Post New Job</Link>
      </div>

      <h3>Recent Job Postings</h3>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <table className="data-table">
          <thead><tr><th>Title</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>
            {jobs.slice(0, 5).map((j) => (
              <tr key={j.id}>
                <td><Link to={`/recruiter/jobs/${j.id}/applicants`}>{j.title}</Link></td>
                <td>{j.location}</td>
                <td>{j.active ? "Active" : "Closed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
