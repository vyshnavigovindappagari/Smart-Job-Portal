import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function CompanyProfile() {
  const [form, setForm] = useState({
    companyName: "", companyWebsite: "", companyAddress: "", designation: "", companyDescription: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/recruiter/profile").then((res) => setForm(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put("/recruiter/profile", form);
    setMessage("Company profile updated!");
  };

  return (
    <div className="page-container">
      <h2>Company Profile</h2>
      {message && <p className="form-success">{message}</p>}
      <form className="stacked-form" onSubmit={handleSubmit}>
        <label>Company Name</label>
        <input value={form.companyName || ""} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
        <label>Website</label>
        <input value={form.companyWebsite || ""} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} />
        <label>Address</label>
        <input value={form.companyAddress || ""} onChange={(e) => setForm({ ...form, companyAddress: e.target.value })} />
        <label>Your Designation</label>
        <input value={form.designation || ""} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
        <label>Company Description</label>
        <textarea value={form.companyDescription || ""} onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} />
        <button className="btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}
