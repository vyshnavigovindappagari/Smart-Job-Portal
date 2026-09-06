import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/jobseeker/applications").then((res) => setApplications(res.data));
  }, []);

  return (
    <div className="page-container">
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Applied On</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id}>
                <td>{a.job?.title}</td>
                <td>{a.job?.recruiter?.fullName}</td>
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
