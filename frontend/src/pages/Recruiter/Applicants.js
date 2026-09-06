import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [interviewFormFor, setInterviewFormFor] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ scheduledAt: "", mode: "ONLINE", location: "", notes: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.get(`/recruiter/jobs/${jobId}/applicants`);
    setApplicants(res.data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    await api.patch(`/recruiter/applications/${appId}/status`, { status });
    load();
  };

  const downloadResume = async (appId, applicantName) => {
    const res = await api.get(`/recruiter/applications/${appId}/resume`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${applicantName}_resume`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const openInterviewForm = (appId) => {
    setInterviewFormFor(appId);
    setInterviewForm({ scheduledAt: "", mode: "ONLINE", location: "", notes: "" });
  };

  const submitInterview = async (e) => {
    e.preventDefault();
    await api.post(`/recruiter/applications/${interviewFormFor}/interview`, interviewForm);
    setMessage("Interview scheduled!");
    setInterviewFormFor(null);
    load();
  };

  return (
    <div className="page-container">
      <h2>Applicants</h2>
      {message && <p className="form-success">{message}</p>}

      {applicants.length === 0 ? (
        <p>No applicants yet for this job.</p>
      ) : (
        <div className="applicants-list">
          {applicants.map((a) => (
            <div className="applicant-card" key={a.id}>
              <div>
                <h4>{a.applicant.fullName}</h4>
                <p>{a.applicant.email}</p>
                <p>Applied: {new Date(a.appliedAt).toLocaleDateString()}</p>
                {a.coverNote && <p><em>"{a.coverNote}"</em></p>}
                <span className={`status-badge status-${a.status.toLowerCase()}`}>{a.status}</span>
              </div>
              <div className="applicant-actions">
                <button className="btn-secondary" onClick={() => downloadResume(a.id, a.applicant.fullName)}>Download Resume</button>
                <button className="btn-primary-sm" onClick={() => updateStatus(a.id, "SHORTLISTED")}>Shortlist</button>
                <button className="btn-link" onClick={() => updateStatus(a.id, "REJECTED")}>Reject</button>
                <button className="btn-secondary" onClick={() => openInterviewForm(a.id)}>Schedule Interview</button>
              </div>

              {interviewFormFor === a.id && (
                <form className="inline-form interview-form" onSubmit={submitInterview}>
                  <input
                    type="datetime-local"
                    required
                    value={interviewForm.scheduledAt}
                    onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                  />
                  <select
                    value={interviewForm.mode}
                    onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                  >
                    <option value="ONLINE">Online</option>
                    <option value="IN_PERSON">In-Person</option>
                  </select>
                  <input
                    placeholder="Meeting link / venue"
                    value={interviewForm.location}
                    onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                  />
                  <button className="btn-primary-sm" type="submit">Confirm</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
