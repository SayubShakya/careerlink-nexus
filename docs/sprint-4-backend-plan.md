# Karaban - Sprint 4 Planning for Week 7 & 8

This sprint transitions the **CareerLink Nexus** from a frontend-heavy mock system to a fully dynamic recruitment platform.

## 📊 Sprint Overview
- **Duration:** 2 Weeks (Week 7 & 8)
- **Primary Goal:** Full implementation of Job Management, CV Engine, and Application Tracking.
- **Tech Stack:** Node.js, Express, Sequelize, PostgreSQL.

---

## 🏗️ PHASE 1: Job Marketplace Foundation (Week 7 - Days 1-2)
*Focus: Bringing the "Jobs" entity to life.*

| Task ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **S4-25** | CRUD API for Job Management | Create `JobListing` model, migrations, and routes. | CRITICAL |
| **S4-19** | Manage Job (Employer) | Backend logic for employers to create/edit/delete their own listings. | HIGH |
| **S4-06** | View Job Details | Fetch full details for a single job including business info. | HIGH |
| **S4-05** | Search Job by Title | Implement basic backend search filtering for seekers. | MEDIUM |
| **S4-08** | Filter by Company | List jobs filtered by specific employer IDs. | MEDIUM |
| **S4-09** | Filter by Individual Jobs | Specialized views for featured or individual listings. | LOW |

---

## 📝 PHASE 2: The Professional CV Engine (Week 7 - Days 3-5)
*Focus: Structured data for the Profile Builder.*

| Task ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **S4-10** | Create New CV | Base API for seeker profile initialization. | HIGH |
| **S4-12** | Build CV Storage | Database management for platform profiles vs uploaded files. | HIGH |
| **S4-14** | CRUD for CV Storage | Endpoints for adding Experience, Education, and Skills. | HIGH |
| **S4-13** | Search CV Feature | Employer search for specific candidate skills/keywords. | MEDIUM |
| **S4-15** | Update Seeker Details | API for updating personal/contact information. | MEDIUM |
| **S4-11** | Export PDF Feature | Generate professional PDF resume from structured profile data. | MEDIUM |

---

## 🚀 PHASE 3: Application Lifecycle (Week 8 - Days 1-3)
*Focus: Connecting people to opportunities.*

| Task ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **S4-07** | Apply Jobs (Refactor) | Link applications to real UUID Job IDs instead of placeholder strings. | CRITICAL |
| **S4-04** | View Application Status | Seeker dashboard tracking (Pending -> Hired). | HIGH |
| **S4-18** | View Recent Applicants | Employer notification/list of newest candidates. | HIGH |
| **S4-20** | Search Candidates | Search within a specific job's applicants by name. | MEDIUM |
| **S4-21** | Filter by Job | View applications grouped/filtered by Job Title. | MEDIUM |
| **S4-22** | Filter by Status | Filter candidates by 'Shortlisted', 'Interviewing', etc. | MEDIUM |

---

## 📉 PHASE 4: Analytics & Admin (Week 8 - Days 4-5)
*Focus: Intelligence and high-level management.*

| Task ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **S4-16** | Stats for Jobseeker | count(applications), count(shortlisted), etc. | MEDIUM |
| **S4-17** | Stats for Employer | count(open_jobs), count(applicants), count(hires). | MEDIUM |
| **S4-23** | Update Company Profile | Professional profile management for employers. | MEDIUM |
| **S4-24** | View Hiring History | Archive of past recruitment cycles. | LOW |
| **S4-26** | User Management API | Admin endpoints for user control. | LOW |
| **S4-27** | System Management | Global configurations and category management. | LOW |

---

## 🛠️ Implementation Steps (The "One-by-One" Guide)

1.  **Step 1: Database Migration.** Update PostgreSQL schema to include `job_listings` and Profile components (Education/Experience).
2.  **Step 2: Core Models.** Create Sequelize models for `JobListing` and link them to `Employer`.
3.  **Step 3: Job CRUD.** Build the endpoints so employers can actually post jobs.
4.  **Step 4: Search & Discovery.** Build the `GET /api/jobs` query engine.
5.  **Step 5: Profile Data.** Implement sub-tables for CV data (Education/Skills).
6.  **Step 6: Application Logic.** Connect Seeker + CV + Job.
7.  **Step 7: Dashboard Stats.** Run group queries to provide numbers for graphs.
8.  **Step 8: PDF Service.** Finalize the resume export logic.
