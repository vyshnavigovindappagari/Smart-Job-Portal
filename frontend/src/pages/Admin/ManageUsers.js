import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const res = await api.get("/admin/jobseekers");
    setUsers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (u) => {
    if (u.blocked) {
      await api.patch(`/admin/users/${u.id}/unblock`);
    } else {
      await api.patch(`/admin/users/${u.id}/block`);
    }
    load();
  };

  return (
    <div className="page-container">
      <h2>Manage Job Seekers</h2>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.blocked ? "Blocked" : "Active"}</td>
              <td>
                <button className="btn-link" onClick={() => toggleBlock(u)}>
                  {u.blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
