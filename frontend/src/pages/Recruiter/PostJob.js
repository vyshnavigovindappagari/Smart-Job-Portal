import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function PostJob() {
  const { id } = useParams(); // present when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", location: "", jobType: "FULL_TIME",
    minSalary: "", maxSalary: "", requiredSkills: "", experienceRequired: "", categoryId: "",
  });

  useEffect(() => {
    api.get("/public/categories").then((res) => setCategories(res.data));
    if (isEdit) {
      api.get(`/public/jobs/${id}`).then((res) => {
        const j = res.data;
        setForm({
          title: j.title, description: j.description, location: j.location || "",
          jobType: j.jobType || "FULL_TIME", minSalary: j.minSalary || "", maxSalary: j.maxSalary || "",
          requiredSkills: j.requiredSkills || "", experienceRequired: j.experienceRequired || "",
          categoryId: j.category?.id || "",
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      minSalary: form.minSalary ? Number(form.minSalary) : null,
      maxSalary: form.maxSalary ? Number(form.maxSalary) : null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    };
    try {
      if (isEdit) {
        await api.put(`/recruiter/jobs/${id}`, payload);
      } else {
        await api.post("/recruiter/jobs", payload);
      }
      navigate("/recruiter/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job.");
    }
  };

  return (
    <div className="page-container">
      <h2>{isEdit ? "Edit Job" : "Post a New Job"}</h2>
      {error && <p className="form-error">{error}</p>}
      <form className="stacked-form" onSubmit={handleSubmit}>
        <label>Job Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows={6} value={form.description} onChange={handleChange} required />

        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} />

        <label>Job Type</label>
        <select name="jobType" value={form.jobType} onChange={handleChange}>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
          <option value="REMOTE">Remote</option>
        </select>

        <label>Category</label>
        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="two-col">
          <div>
            <label>Min Salary</label>
            <input type="number" name="minSalary" value={form.minSalary} onChange={handleChange} />
          </div>
          <div>
            <label>Max Salary</label>
            <input type="number" name="maxSalary" value={form.maxSalary} onChange={handleChange} />
          </div>
        </div>

        <label>Required Skills (comma separated)</label>
        <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="Java, Spring Boot, React" />

        <label>Experience Required</label>
        <input name="experienceRequired" value={form.experienceRequired} onChange={handleChange} placeholder="e.g. 2-4 years" />

        <button className="btn-primary" type="submit">{isEdit ? "Update Job" : "Post Job"}</button>
      </form>
    </div>
  );
}
