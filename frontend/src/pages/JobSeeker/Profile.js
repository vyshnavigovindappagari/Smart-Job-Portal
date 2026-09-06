import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: "", address: "", headline: "", about: "", skills: "" });
  const [eduForm, setEduForm] = useState({ degree: "", institution: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "" });
  const [expForm, setExpForm] = useState({ jobTitle: "", companyName: "", startDate: "", endDate: "", currentlyWorking: false, description: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    const res = await api.get("/jobseeker/profile");
    setProfile(res.data);
    setForm({
      phone: res.data.phone || "",
      address: res.data.address || "",
      headline: res.data.headline || "",
      about: res.data.about || "",
      skills: res.data.skills || "",
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await api.put("/jobseeker/profile", form);
    setMessage("Profile updated!");
    loadProfile();
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    const data = new FormData();
    data.append("file", resumeFile);
    await api.post("/jobseeker/profile/resume", data, { headers: { "Content-Type": "multipart/form-data" } });
    setMessage("Resume uploaded!");
    loadProfile();
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    await api.post("/jobseeker/profile/education", eduForm);
    setEduForm({ degree: "", institution: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "" });
    loadProfile();
  };

  const handleDeleteEducation = async (id) => {
    await api.delete(`/jobseeker/profile/education/${id}`);
    loadProfile();
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    await api.post("/jobseeker/profile/experience", expForm);
    setExpForm({ jobTitle: "", companyName: "", startDate: "", endDate: "", currentlyWorking: false, description: "" });
    loadProfile();
  };

  const handleDeleteExperience = async (id) => {
    await api.delete(`/jobseeker/profile/experience/${id}`);
    loadProfile();
  };

  if (!profile) return <div className="page-container"><p>Loading...</p></div>;

  return (
    <div className="page-container">
      <h2>My Profile</h2>
      {message && <p className="form-success">{message}</p>}

      <section className="card-section">
        <h3>Basic Info</h3>
        <form className="stacked-form" onSubmit={handleProfileSave}>
          <label>Headline</label>
          <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Full Stack Developer" />
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label>Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <label>About</label>
          <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
          <label>Skills (comma separated)</label>
          <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Java, React, SQL" />
          <button className="btn-primary" type="submit">Save Profile</button>
        </form>
      </section>

      <section className="card-section">
        <h3>Resume</h3>
        {profile.resumeFileName ? <p>Current resume: {profile.resumeFileName}</p> : <p>No resume uploaded yet.</p>}
        <form className="stacked-form" onSubmit={handleResumeUpload}>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
          <button className="btn-secondary" type="submit">Upload Resume</button>
        </form>
      </section>

      <section className="card-section">
        <h3>Education</h3>
        {profile.education?.map((ed) => (
          <div className="list-item" key={ed.id}>
            <div>
              <strong>{ed.degree}</strong> - {ed.institution} ({ed.startYear} - {ed.endYear})
            </div>
            <button className="btn-link" onClick={() => handleDeleteEducation(ed.id)}>Remove</button>
          </div>
        ))}
        <form className="inline-form" onSubmit={handleAddEducation}>
          <input placeholder="Degree" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} required />
          <input placeholder="Institution" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} required />
          <input placeholder="Field of Study" value={eduForm.fieldOfStudy} onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })} />
          <input placeholder="Start Year" value={eduForm.startYear} onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })} />
          <input placeholder="End Year" value={eduForm.endYear} onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })} />
          <button className="btn-secondary" type="submit">Add</button>
        </form>
      </section>

      <section className="card-section">
        <h3>Experience</h3>
        {profile.experience?.map((ex) => (
          <div className="list-item" key={ex.id}>
            <div>
              <strong>{ex.jobTitle}</strong> - {ex.companyName} ({ex.startDate} - {ex.currentlyWorking ? "Present" : ex.endDate})
            </div>
            <button className="btn-link" onClick={() => handleDeleteExperience(ex.id)}>Remove</button>
          </div>
        ))}
        <form className="inline-form" onSubmit={handleAddExperience}>
          <input placeholder="Job Title" value={expForm.jobTitle} onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })} required />
          <input placeholder="Company" value={expForm.companyName} onChange={(e) => setExpForm({ ...expForm, companyName: e.target.value })} required />
          <input placeholder="Start Date" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} />
          <input placeholder="End Date" value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} disabled={expForm.currentlyWorking} />
          <label className="checkbox-label">
            <input type="checkbox" checked={expForm.currentlyWorking} onChange={(e) => setExpForm({ ...expForm, currentlyWorking: e.target.checked })} />
            Currently working here
          </label>
          <button className="btn-secondary" type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}
