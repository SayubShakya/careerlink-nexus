# 📝 PLAN: Real-World Google SSO Onboarding Refinement

Based on standard real-world practices (e.g., LinkedIn, Indeed, modern SaaS apps), the current Google Sign-Up and Log-In flow has several critical gaps and friction points that need resolving. This plan outlines exactly how to bring the implementation up to real-world standards.

## 1. Problem Space Analysis

1.  **Friction Point: The "Double Login"**
    *   **Current State:** When a user goes to `/register/jobseeker` and clicks "Sign up with Google", the backend creates their account and returns a `201`. The frontend then issues a toast and forces a redirect to `/login`, requiring them to click "Sign in with Google" a *second* time.
    *   **Real-World Standard:** SSO should be frictionless. Upon successful account creation via SSO, the user should be instantly granted an active session and redirected directly to their dashboard.

2.  **Data Integrity Gap: Employer Dummy Data**
    *   **Current State:** When an employer signs up via Google, the backend auto-generates garbage data: `companyName: \`Name's Org\`` and `companyWebsite: 'https://example.com'`.
    *   **Real-World Standard:** B2B platforms cannot function with dummy data for core fields (company name and website are essential for job postings). If an employer signs up via Google, we must still collect these strictly required fields.
    *   **Solution:** Employer "Sign up with Google" should open a tiny modal/view to enter just `Company Name` and `Company Website` before completing the registration.

3.  **Strict Login Rejection UX**
    *   **Current State:** If you enter via `/login` and don't have an account, you get an error: "No account found. Please sign up."
    *   **Real-World Standard:** This is actually a highly secure and correct pattern for strict two-sided marketplaces. However, the copy should be polite and guide them clearly, perhaps offering a direct link to the central `/register` portal within the toast or UI. Our current strict rejection works well logically but can be slightly polished.

## 2. Implementation Steps (Phase 2)

### A. Frontend Specialist (UI & UX Friction Removal)
1.  **Jobseeker Signup Polish:** Update `JobseekerSignup.jsx`. On `201 Created` from Google SSO, treat it as a successful *login* (because `createSendToken` already gave us the token). Remove the `navigate(ROUTES.LOGIN)` and immediately redirect them to the `JOBSEEKER_DASHBOARD`. This removes the "double login" friction completely.
2.  **Employer Signup Polish:** Similar to Jobseeker, remove the double-login redirect and take them straight to the `EMPLOYER_DASHBOARD`. *(Security Auditor caveat: Are we okay with dummy data for now, or do we implement a missing-data interceptor?)* Given the scope, the quickest real-world fix is to intercept this dummy data inside the app. For this immediate iteration, we will simply remove the double login.

### B. Backend Specialist (Logic Validation)
1.  Review `authController.googleVerify`. Ensure the `.status(201)` and `.status(200)` correctly attach the JWT cookie and send back the token required by the frontend logic.
2.  Clean up the payload generation for employers, perhaps leaving `is_sso: true` to allow future "complete your profile" gating on the dashboard.

### C. Security Auditor (Verification)
1.  Verify the JWTs are securely handled on signup.
2.  Execute standard security scan (`security_scan.py`).

---
**Prepared by `project-planner`. Awaiting approval to execute Phase 2.**
