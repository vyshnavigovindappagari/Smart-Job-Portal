import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="page-container"><p>Loading...</p></div>;

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>
      <div className="stats-row">
        <div className="stat-card"><h3>{stats.totalJobSeekers}</h3><p>Job Seekers</p></div>
        <div className="stat-card"><h3>{stats.totalRecruiters}</h3><p>Recruiters</p></div>
        <div className="stat-card"><h3>{stats.pendingRecruiters}</h3><p>Pending Approvals</p></div>
        <div className="stat-card"><h3>{stats.totalJobs}</h3><p>Total Jobs</p></div>
        <div className="stat-card"><h3>{stats.activeJobs}</h3><p>Active Jobs</p></div>
        <div className="stat-card"><h3>{stats.totalApplications}</h3><p>Applications</p></div>
      </div>

      <div className="dashboard-links">
        <Link to="/admin/users" className="btn-secondary">Manage Job Seekers</Link>
        <Link to="/admin/recruiters" className="btn-secondary">Manage Recruiters</Link>
        <Link to="/admin/jobs" className="btn-secondary">Manage Jobs</Link>
        <Link to="/admin/categories" className="btn-secondary">Manage Categories</Link>
      </div>
    </div>
  );
}
