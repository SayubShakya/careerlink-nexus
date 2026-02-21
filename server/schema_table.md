# CareerLink Nexus - Database Schema Table

This document outlines the final database structure for the CareerLink Nexus application, including tables, columns, data types, and relationships.

## 1. Authentication & Roles

### `roles`
Stores the different user roles in the system.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, NOT NULL | Unique identifier |
| `name` | STRING(50) | NOT NULL, UNIQUE | `job_seeker`, `employer`, `admin` |
| `created_at`| TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at`| TIMESTAMP | | Record update time |

---

## 2. User Profiles & CV Builder

### `job_seeker_users`
Auth & Identity table for seekers.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `email` | STRING | UNIQUE | |
| `first_name` | STRING | | |
| `last_name` | STRING | | |
| `profile_picture`| STRING | | |

### `profiles`
Core professional profile base.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `user_id` | UUID | FK -> job_seeker_users.id | 1:1 Relationship |
| `headline` | STRING | | "Senior Software Engineer" |
| `bio` | TEXT | | Executive summary |
| `phone` | STRING | | |
| `location` | STRING | | "City, Country" |

### `personal_experiences`
Detailed work history records.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `profile_id` | UUID | FK -> profiles.id | |
| `company_name` | STRING | | |
| `job_title` | STRING | | |
| `description` | TEXT | | |

### `personal_education`
Academic history records.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `profile_id` | UUID | FK -> profiles.id | |
| `institution` | STRING | | |
| `degree` | STRING | | |

### `personal_skills`
User-defined skill sets.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `profile_id` | UUID | FK -> profiles.id | |
| `skill_name` | STRING | | |
| `skill_type` | ENUM | | `Technical`, `Soft`, etc. |

### `personal_projects` & `personal_trainings`
Additional portfolio and certification tables (Relational).

### `resumes`
Stores uploaded PDF CV files specifically.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `profile_id` | UUID | FK -> profiles.id | Owner reference |
| `resume_url` | TEXT | NOT NULL | Path/URL to PDF file |
| `is_default` | BOOLEAN | DEFAULT TRUE | Primary resume flag |

---

## 3. Specialized Views

### `job_seeker_full_profile_view`
A Virtual Table (SQL VIEW) that aggregates all the above tables into a single JSON-rich object for the **CV Dynamic Builder**.
*   **Source Tables**: `job_seeker_users`, `profiles`, `personal_experiences`, `personal_education`, `personal_skills`, `personal_projects`, `personal_trainings`, `personal_social_links`.
*   **Output**: Aggregated JSON Arrays for all nested collections.

---

## 4. Employer & Job Engine

### `employer_users`
Auth & Profile table for recruiters/companies.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `email` | STRING | UNIQUE | |
| `companyName` | STRING | NOT NULL | |
| `companyWebsite`| STRING | | |
| `description` | TEXT | | Company about/bio |
| `location` | STRING | | "City, Country" |
| `industry` | STRING | | IT, Health, etc. |
| `contact_person`| STRING | | |
| `is_verified` | BOOLEAN | DEFAULT FALSE | |
| `profile_picture`| STRING | | Company Logo |

### `job_listings`
Job postings created by employers.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, NOT NULL | Unique identifier |
| `employer_id` | UUID | FK -> employer_users(id)| The posting employer |
| `title` | STRING(255)| NOT NULL | Job title |
| `description` | TEXT | NOT NULL | Full job description |
| `responsibilities`| JSON | | List of responsibilities |
| `requirements` | JSON | | List of requirements |
| `skills` | JSON | | List of needed skills |
| `location` | STRING(255)| NOT NULL | Office location/Remote |
| `salary` | STRING(100)| | Salary range/fixed |
| `jobType` | ENUM | | `Full Time`, `Part-Time`, etc.|
| `vacancy` | INTEGER | DEFAULT 1 | Number of openings |
| `deadline` | DATE | | Application deadline |
| `views` | INTEGER | DEFAULT 0 | View tracker |
| `is_active` | BOOLEAN | DEFAULT TRUE | Visibility toggle |
| `created_at`| TIMESTAMP | | |

### `saved_jobs`
Junction table for bookmarked jobs.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, NOT NULL | |
| `seeker_id` | UUID | FK -> job_seeker_users(id)| |
| `job_id` | UUID | FK -> job_listings(id) | |
| `saved_at` | TIMESTAMP | DEFAULT NOW() | |

---

## 4. Applications & CVs

### `cv_storage`
Stores both platform-built CVs and file uploads.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, NOT NULL | |
| `user_id` | UUID | FK -> job_seeker_users(id)| |
| `title` | STRING(255)| NOT NULL | "Front-End Developer CV"|
| `type` | ENUM | | `platform` or `uploaded` |
| `file_path` | STRING(255)| | For `uploaded` types |
| `content` | JSON | | For `platform` builder |
| `is_primary` | BOOLEAN | DEFAULT FALSE | Default CV flag |

### `applications`
Junction table linking seekers to jobs.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `job_id` | UUID | FK -> job_listings.id | |
| `job_seeker_id` | UUID | FK -> job_seeker_users.id| |
| `application_method`| ENUM | | `platform_cv`, `pdf_resume`, `both` |
| `resume_id` | UUID | FK -> resumes.id | CV reference |
| `status` | ENUM | DEFAULT `applied` | `applied`, `reviewed`, `shortlisted`, `interview_scheduled`, `rejected`|
| `cover_letter` | TEXT | | Optional note |
| `applied_at` | TIMESTAMP | DEFAULT NOW() | |

---

## 5. Infrastructure & Admin

### `notifications`
In-app notification records.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, NOT NULL | |
| `user_id` | UUID | NOT NULL | Related user ID |
| `user_type` | ENUM | NOT NULL | `job_seeker` or `employer`|
| `title` | STRING(255)| NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Content body |
| `link` | STRING(255)| | Internal redirection link|
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `created_at`| TIMESTAMP | | |

### `categories`
Global job industry categories.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | | |
| `name` | STRING(100)| UNIQUE | `Engineering`, `Marketing`|

### `skills_library`
Global Skill tags managed by admin.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | | |
| `name` | STRING(100)| UNIQUE | `React.js`, `Python` |
