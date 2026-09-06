import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";

import JobSeekerDashboard from "./pages/JobSeeker/Dashboard";
import JobSeekerProfile from "./pages/JobSeeker/Profile";
import MyApplications from "./pages/JobSeeker/MyApplications";
import SavedJobs from "./pages/JobSeeker/SavedJobs";

import RecruiterDashboard from "./pages/Recruiter/Dashboard";
import CompanyProfile from "./pages/Recruiter/CompanyProfile";
import PostJob from "./pages/Recruiter/PostJob";
import ManageJobsRecruiter from "./pages/Recruiter/ManageJobs";
import Applicants from "./pages/Recruiter/Applicants";

import AdminDashboard from "./pages/Admin/Dashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageRecruiters from "./pages/Admin/ManageRecruiters";
import ManageJobsAdmin from "./pages/Admin/ManageJobs";
import ManageCategories from "./pages/Admin/ManageCategories";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Job Seeker routes */}
          <Route path="/jobseeker/dashboard" element={
            <PrivateRoute roles={["JOB_SEEKER"]}><JobSeekerDashboard /></PrivateRoute>
          } />
          <Route path="/jobseeker/profile" element={
            <PrivateRoute roles={["JOB_SEEKER"]}><JobSeekerProfile /></PrivateRoute>
          } />
          <Route path="/jobseeker/applications" element={
            <PrivateRoute roles={["JOB_SEEKER"]}><MyApplications /></PrivateRoute>
          } />
          <Route path="/jobseeker/saved-jobs" element={
            <PrivateRoute roles={["JOB_SEEKER"]}><SavedJobs /></PrivateRoute>
          } />

          {/* Recruiter routes */}
          <Route path="/recruiter/dashboard" element={
            <PrivateRoute roles={["RECRUITER"]}><RecruiterDashboard /></PrivateRoute>
          } />
          <Route path="/recruiter/profile" element={
            <PrivateRoute roles={["RECRUITER"]}><CompanyProfile /></PrivateRoute>
          } />
          <Route path="/recruiter/post-job" element={
            <PrivateRoute roles={["RECRUITER"]}><PostJob /></PrivateRoute>
          } />
          <Route path="/recruiter/jobs" element={
            <PrivateRoute roles={["RECRUITER"]}><ManageJobsRecruiter /></PrivateRoute>
          } />
          <Route path="/recruiter/jobs/:id/edit" element={
            <PrivateRoute roles={["RECRUITER"]}><PostJob /></PrivateRoute>
          } />
          <Route path="/recruiter/jobs/:jobId/applicants" element={
            <PrivateRoute roles={["RECRUITER"]}><Applicants /></PrivateRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={["ADMIN"]}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute roles={["ADMIN"]}><ManageUsers /></PrivateRoute>
          } />
          <Route path="/admin/recruiters" element={
            <PrivateRoute roles={["ADMIN"]}><ManageRecruiters /></PrivateRoute>
          } />
          <Route path="/admin/jobs" element={
            <PrivateRoute roles={["ADMIN"]}><ManageJobsAdmin /></PrivateRoute>
          } />
          <Route path="/admin/categories" element={
            <PrivateRoute roles={["ADMIN"]}><ManageCategories /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
