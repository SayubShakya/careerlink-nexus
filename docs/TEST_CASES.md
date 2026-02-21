# CareerLink Nexus - Master Test Case Document

This document tracks all functional and integration test cases for the CareerLink Nexus platform. Each test case is aligned with the project requirements and Task IDs defined in the Sprint Plans.

---

## 🔐 1. Authentication & User Management (S4-Auth)

| Test ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Seeker Registration | Create a new Job Seeker account with valid details. | User created, token returned, redirected to Seeker Dashboard. | ✅ PASSED |
| **TC-AUTH-02** | Employer Registration| Create a new Employer account with valid details. | User created, token returned, redirected to Employer Dashboard. | ✅ PASSED |
| **TC-AUTH-03** | Login (Success) | Authenticate with correct email and password. | JWT token generated, session established, role-correct redirect. | ✅ PASSED |
| **TC-AUTH-04** | Login (Fail) | Authenticate with incorrect password or non-existent email. | 401 Unauthorized Error with "Incorrect email or password" message. | ✅ PASSED |
| **TC-AUTH-05** | Unauthorized Access | Attempt to access protected dashboard without a token. | 401 Unauthorized Error, redirected to login page. | ✅ PASSED |
| **TC-AUTH-06** | Logout | Terminate the current session and clear cookies. | Token invalidated (client-side), session destroyed (server-side). | ✅ PASSED |

---

## 👤 2. Job Seeker Profile & CV builder (S4-Profile)

| Test ID | Task ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-PROF-01** | S4-15 | Update Seeker Info | Update firstName, lastName, and headline. | Profile updated in `job_seeker_users` and `profiles` tables. | ✅ PASSED |
| **TC-PROF-02** | S4-14 | Add Experience | Add a work history record to the profile. | Data saved in `personal_experiences`, visible in CV preview. | ✅ PASSED |
| **TC-PROF-03** | S4-14 | Add Education | Add university and degree details. | Data saved in `personal_education`. | ✅ PASSED |
| **TC-PROF-04** | S4-12 | CV Upload | Upload a local PDF file as a CV. | File saved to `/uploads`, path saved in `cv_storage`. | ✅ PASSED |
| **TC-PROF-05** | S4-10 | Platform CV Create | Build a CV using the internal editor components. | Content saved as JSON in `cv_storage`. | ✅ PASSED |
| **TC-PROF-06** | S4-11 | Export to PDF | Download the platform-built CV as a PDF file. | PDF generated dynamically via `pdfGenerator` logic. | ✅ PASSED |

---

## 🔍 3. Job Search & Discovery (S4-Search)

| Test ID | Task ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-JOB-01** | S4-06 | View Job List | Fetch all active jobs for the homepage feed. | returns array of jobs with nested Employer info. | ✅ PASSED |
| **TC-JOB-02** | S4-06 | View Job Details | Click on a job to see full description and specs. | 200 OK with full job object including responsibilities. | ✅ PASSED |
| **TC-JOB-03** | S4-05 | Search by Title | Filter jobs by typing "Software" in the search bar. | List updates to show only jobs matching the keyword. | ✅ PASSED |
| **TC-JOB-04** | S4-08 | Filter by Company | View jobs posted only by "Tech Nexus". | Result set limited to the specific employer ID. | ✅ PASSED |
| **TC-JOB-05** | N/A | Saved Jobs | Click the "Heart" icon to save a job for later. | Record added to `saved_jobs` table. | ✅ PASSED |

---

## 🚀 4. Job Application Lifecycle (S4-Apply)

| Test ID | Task ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-APP-01** | S4-07 | Apply with Platform CV| Select an existing platform CV and submit. | Application created with method `platform_cv`. | ✅ PASSED |
| **TC-APP-02** | S4-07 | Apply with Upload | Select an uploaded PDF file and submit. | Application created with method `pdf_resume`. | ✅ PASSED |
| **TC-APP-03** | S4-04 | Track Application | Seeker views their application status in dashboard. | Shows status as "applied", "shortlisted", etc. | ✅ PASSED |
| **TC-APP-04** | S4-07 | Prevent Duplicates | Attempt to apply for the same job twice. | "You have already applied for this job" error. | ✅ PASSED |

---

## 🏢 5. Employer Dashboard & Job Management (S4-Emp)

| Test ID | Task ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-EMP-01** | S4-25 | Post a New Job | Create a job listing with full specs. | Job saved in `job_listings`, linked to employer ID. | ✅ PASSED |
| **TC-EMP-02** | S4-19 | Edit Active Job | Update the salary or description of a post. | Changes saved, immediately reflected on seeker side. | ✅ PASSED |
| **TC-EMP-03** | S4-18 | View Applicants | See list of people who applied for a specific job. | Returns list with seeker names and CV links. | ✅ PASSED |
| **TC-EMP-04** | S4-04 | Update Status | Reviewer changes status to "Shortlisted". | Application table updated; Notification triggered. | ✅ PASSED |
| **TC-EMP-05** | S4-17 | Dashboard Stats | View count of active jobs and total applicants. | Stats match the real counts in the database. | ✅ PASSED |
| **TC-EMP-06** | S4-23 | Update Company | Change company logo and description. | Data updated in `employer_users` table. | ✅ PASSED |

---

## 🎨 6. UI/UX, Theme & Accessibility (S4-UI)

| Test ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UI-01** | Theme Switching | Toggle between Light and Dark mode using the theme icon. | All components (cards, text, inputs) shift to the correct theme variables. | PENDING |
| **TC-UI-02** | Navbar Consistency| Log in as Employer, then Job Seeker. | Navbars/Sidebars switch correctly; Seeker sees Navbar, Employer sees Sidebar. | PENDING |
| **TC-UI-03** | Profile Avatars | Check Job Seeker avatar and Employer logo in dashboards. | Images load correctly via proxy (no broken 404 icons). | PENDING |
| **TC-UI-04** | Responsive Menu | Open Employer Dashboard on a mobile-sized screen. | Sidebar collapses/hides; Toggle button becomes visible/functional. | PENDING |

---

## 💎 7. Field Integrity & "Zero-Null" Checks

| Test ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-NULL-01** | Dashboard Feed | View Seeker Dashboard with seeded data. | No "undefined" or "null" text labels visible in job cards. | PENDING |
| **TC-NULL-02** | Job Details View | Open the "Senior Frontend Developer" detail page. | Responsibilities and Qualifications are displayed as clean strings, not JSON brackets. | PENDING |
| **TC-NULL-03** | My Profile Data | Check the Edit Profile form for Alice Smith. | All fields (Headline, Summary, Location, Phone) are pre-populated with seeded data. | PENDING |
| **TC-NULL-04** | Application Details| View an application as an Employer. | Candidate name, email, and CV link are all valid and clickable. | PENDING |

---

## 🔔 8. Notifications & System Logic (S4-SYS)

| Test ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-SYS-01** | Application Notif | Notify employer when a new application arrives. | Notification entry created in `notifications` table. | ✅ PASSED |
| **TC-SYS-02** | Status Notif | Notify seeker when status changes (e.g., Shortlisted). | In-app notification visible in seeker dashboard. | PENDING |
| **TC-SYS-03** | RBAC Enforcement | Seeker tries to access `/api/jobs` POST endpoint. | 403 Forbidden - "You do not have permission". | ✅ PASSED |

---

## 🧪 9. Edge Cases & Safety

| Test ID | Requirement | Description | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-EDGE-01** | Expired Token | Access dashboard with a token that has expired. | 401 Unauthorized, forced logout. | ✅ PASSED |
| **TC-EDGE-02** | Invalid Input | Submit profile update with invalid email format. | Frontend validation prevents submission; Backend returns 400. | PENDING |
| **TC-EDGE-03** | Deleted Job | Access a Job Detail page for a job that was deleted. | 404 Job Not Found error. | ✅ PASSED |

---
*Last Updated: 2026-02-21*
*Document Managed by: Quality Manager (Antigravity)*
