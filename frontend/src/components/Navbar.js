import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardLink = () => {
    if (!user) return null;
    if (user.role === "JOB_SEEKER") return "/jobseeker/dashboard";
    if (user.role === "RECRUITER") return "/recruiter/dashboard";
    if (user.role === "ADMIN") return "/admin/dashboard";
    return "/";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🚀 Smart Job Portal
      </Link>
      <div className="navbar-links">
        <Link to="/jobs">Browse Jobs</Link>
        {user ? (
          <>
            <Link to={dashboardLink()}>Dashboard</Link>
            <span className="navbar-user">Hi, {user.fullName}</span>
            <button className="btn-link" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
