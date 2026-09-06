import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import JobCard from "../components/JobCard";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", location: "", categoryId: "", jobType: "" });
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const res = await api.get("/public/categories");
    setCategories(res.data);
  };

  const fetchJobs = async () => {
    setLoading(true);
    const params = {};
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.location) params.location = filters.location;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.jobType) params.jobType = filters.jobType;
    const res = await api.get("/public/jobs", { params });
    setJobs(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="page-container">
      <h2>Browse Jobs</h2>

      <form className="filters-bar" onSubmit={handleSearch}>
        <input
          name="keyword"
          placeholder="Job title, skill, or keyword"
          value={filters.keyword}
          onChange={handleFilterChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select name="jobType" value={filters.jobType} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
          <option value="REMOTE">Remote</option>
        </select>
        <button className="btn-primary" type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found. Try adjusting your filters.</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
