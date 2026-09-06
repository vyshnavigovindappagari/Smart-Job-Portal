import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function ManageRecruiters() {
  const [recruiters, setRecruiters] = useState([]);

  const load = async () => {
    const res = await api.get("/admin/recruiters");
    setRecruiters(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.patch(`/admin/recruiters/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    await api.patch(`/admin/recruiters/${id}/reject`);
    load();
  };

  const toggleBlock = async (r) => {
    if (r.blocked) await api.patch(`/admin/users/${r.id}/unblock`);
    else await api.patch(`/admin/users/${r.id}/block`);
    load();
  };

  return (
    <div className="page-container">
      <h2>Manage Recruiters</h2>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>Approval Status</th><th>Account Status</th><th>Actions</th></tr></thead>
        <tbody>
          {recruiters.map((r) => (
            <tr key={r.id}>
              <td>{r.fullName}</td>
              <td>{r.email}</td>
              <td><span className={`status-badge status-${r.recruiterStatus?.toLowerCase()}`}>{r.recruiterStatus}</span></td>
              <td>{r.blocked ? "Blocked" : "Active"}</td>
              <td className="table-actions">
                {r.recruiterStatus === "PENDING" && (
                  <>
                    <button className="btn-primary-sm" onClick={() => approve(r.id)}>Approve</button>
                    <button className="btn-link" onClick={() => reject(r.id)}>Reject</button>
                  </>
                )}
                <button className="btn-link" onClick={() => toggleBlock(r)}>
                  {r.blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
