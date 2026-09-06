import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);

  const load = async () => {
    const res = await api.get("/admin/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this job posting?")) return;
    await api.delete(`/admin/jobs/${id}`);
    load();
  };

  return (
    <div className="page-container">
      <h2>Manage Jobs</h2>
      <table className="data-table">
        <thead><tr><th>Title</th><th>Recruiter</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>{j.title}</td>
              <td>{j.recruiter?.fullName}</td>
              <td>{j.location}</td>
              <td>{j.active ? "Active" : "Closed"}</td>
              <td><button className="btn-link" onClick={() => handleDelete(j.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
