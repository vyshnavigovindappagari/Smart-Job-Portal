import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post("/admin/categories", form);
    setForm({ name: "", description: "" });
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/admin/categories/${id}`);
    load();
  };

  return (
    <div className="page-container">
      <h2>Manage Categories</h2>

      <form className="inline-form" onSubmit={handleAdd}>
        <input placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn-primary-sm" type="submit">Add Category</button>
      </form>

      <table className="data-table">
        <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td><button className="btn-link" onClick={() => handleDelete(c.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
