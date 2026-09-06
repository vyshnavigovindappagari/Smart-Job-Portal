# 🚀 Smart Job Portal & Recruitment Management System

A beginner-friendly, full-stack **Job Portal and Recruitment Management System** built with
**React.js** (frontend) and **Spring Boot 3 / Java 17** (backend), backed by **MySQL 8**.

Three roles are supported out of the box: **Job Seeker**, **Recruiter**, and **Admin**.

---

## 📁 Project Structure

```
job-portal/
├── backend/          Spring Boot 3 REST API (Java 17, Spring Security + JWT, JPA)
├── frontend/          React.js single-page app (React Router, Axios)
├── database/          Reference SQL schema (schema.sql)
└── README.md
```

---

## ✨ Features

### Job Seeker
- Register / Login (JWT-secured)
- Profile: headline, about, phone, address, skills
- Education history (add/remove)
- Work experience (add/remove)
- Resume upload (PDF/DOC/DOCX)
- Search & filter jobs (keyword, location, category, job type)
- Apply to jobs with an optional cover note
- Save jobs for later
- Track application status (Applied → Shortlisted → Interview Scheduled → Hired/Rejected)

### Recruiter
- Register / Login (requires **admin approval** before posting jobs)
- Company profile (name, website, address, description)
- Post / edit / delete job listings
- View applicants per job
- Download applicant resumes
- Shortlist / reject candidates
- Schedule interviews (date/time, mode, location/link, notes)

### Admin
- Login (seeded automatically, see credentials below)
- Dashboard with platform statistics
- Approve / reject pending recruiter accounts
- Block / unblock job seekers and recruiters
- Manage job categories (create/delete)
- View & remove any job posting

---

## 🛠️ Tech Stack

| Layer      | Technology                                              |
|------------|----------------------------------------------------------|
| Frontend   | React.js, React Router, Axios, HTML5, CSS3               |
| Backend    | Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JWT (jjwt), Maven |
| Database   | MySQL 8                                                   |

---

## ✅ Prerequisites

Make sure you have installed:

- **Java 17+** and **Maven 3.8+**
- **Node.js 18+** and **npm**
- **MySQL 8** running locally (or a MySQL server you can connect to)

---

## 🗄️ 1. Database Setup

You do **not** need to run the SQL file manually — the backend is configured with
`spring.jpa.hibernate.ddl-auto=update`, so Hibernate will automatically create the database
(`job_portal_db`) and all tables the first time it starts.

If you'd prefer to inspect or run the schema manually, use `database/schema.sql`:

```bash
mysql -u root -p < database/schema.sql
```

Update the MySQL username/password in `backend/src/main/resources/application.properties`
if they differ from the defaults (`root` / `root`).

---

## ⚙️ 2. Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API will start on **http://localhost:8080**.

On first run, a `DataSeeder` automatically creates:
- A default **admin account**: `admin@jobportal.com` / `Admin@123`
- A set of default job categories (IT, Marketing, Sales, Finance, HR, Design, Support, Engineering)

### Key backend configuration (`application.properties`)
- `server.port=8080`
- MySQL connection string, username, and password
- JWT secret key and expiration (24h by default)
- File upload directory for resumes: `uploads/resumes`
- CORS allowed origin: `http://localhost:3000` (the React dev server)

### Main REST API Endpoints

| Area        | Endpoint                                         | Auth              |
|-------------|---------------------------------------------------|--------------------|
| Auth        | `POST /api/auth/register`, `POST /api/auth/login` | Public             |
| Public jobs | `GET /api/public/jobs`, `GET /api/public/jobs/{id}` | Public           |
| Categories  | `GET /api/public/categories`                       | Public             |
| Job Seeker  | `/api/jobseeker/**` (profile, resume, apply, save) | JOB_SEEKER role   |
| Recruiter   | `/api/recruiter/**` (jobs CRUD, applicants, interviews) | RECRUITER role |
| Admin       | `/api/admin/**` (users, recruiters, jobs, categories, stats) | ADMIN role  |

---

## 💻 3. Frontend Setup (React)

In a **new terminal**:

```bash
cd frontend
npm install
npm start
```

The app will start on **http://localhost:3000** and proxy API calls to
`http://localhost:8080` (configured via the `proxy` field in `package.json`).

---

## 🔑 Demo Accounts

| Role      | Email                  | Password    |
|-----------|------------------------|-------------|
| Admin     | admin@jobportal.com    | Admin@123   |
| Job Seeker| (register your own)    | —           |
| Recruiter | (register your own)    | —           |

> **Note:** New recruiter accounts start in `PENDING` status. Log in as **Admin** →
> **Manage Recruiters** → **Approve** before the recruiter can post jobs.

---

## 🧭 Typical Walkthrough

1. **Register** as a Recruiter → log in as Admin → approve the recruiter.
2. Log back in as the Recruiter → complete company profile → post a job.
3. **Register** as a Job Seeker → complete profile (skills, education, experience) → upload a resume.
4. Browse jobs → apply to the posted job.
5. Log back in as the Recruiter → view applicants → download resume → shortlist → schedule an interview.
6. Log in as the Job Seeker → check **My Applications** to see the status update.

---

## 📦 Building for Production

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/job-portal-backend.jar
```

**Frontend:**
```bash
cd frontend
npm run build
```
This produces a static `build/` folder you can serve with any static file server or
behind the Spring Boot backend using a reverse proxy (e.g., Nginx).

---

## 🔒 Security Notes (for learning, not production)

- Passwords are hashed with BCrypt.
- Authentication uses stateless JWTs (`Authorization: Bearer <token>`).
- Change `app.jwt.secret` in `application.properties` before deploying anywhere real.
- Resume files are stored on the local filesystem (`uploads/resumes`) — for production use
  a proper object store (e.g., AWS S3) instead.

---

## 🧩 Possible Next Steps (learning extensions)

- Add pagination to job search results
- Add email notifications (application received, interview scheduled)
- Add a "forgot password" flow
- Add unit/integration tests (JUnit + Mockito, React Testing Library)
- Deploy backend (Render/Railway) + frontend (Vercel/Netlify) + managed MySQL

---

Happy learning! 🎓
