import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);

  const load = async () => {
    const res = await api.get("/recruiter/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    await api.delete(`/recruiter/jobs/${id}`);
    load();
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <h2>Manage Jobs</h2>
        <Link to="/recruiter/post-job" className="btn-primary">+ Post New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Title</th><th>Location</th><th>Type</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>{j.title}</td>
                <td>{j.location}</td>
                <td>{j.jobType}</td>
                <td>{j.active ? "Active" : "Closed"}</td>
                <td className="table-actions">
                  <Link to={`/recruiter/jobs/${j.id}/applicants`}>Applicants</Link>
                  <Link to={`/recruiter/jobs/${j.id}/edit`}>Edit</Link>
                  <button className="btn-link" onClick={() => handleDelete(j.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
