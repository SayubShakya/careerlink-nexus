import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ROUTES } from './routes';
import Home from '../pages/Home';
import Jobs from '../pages/jobs/Jobs';
import ContactUs from '../pages/contact-us/ContactUs';
import ProfileSetup from '../pages/profile/ProfileSetup';
import Login from '../pages/login/Login';
import Signup from '../pages/signup/Signup';
import JobseekerSignup from '../pages/signup/JobseekerSignup';
import EmployerSignup from '../pages/signup/EmployerSignup';
import JobSeekerDashboard from '../pages/dashboard/JobSeekerDashboard';
import EmployerDashboard from '../pages/dashboard/EmployerDashboard';
import JobManagement from '../pages/employer/job-management/JobManagement';
import Applications from '../pages/employer/applications/Applications';
import History from '../pages/employer/history/History';
import CVBuilder from '../pages/cv-builder/CVBuilder';
import CompanyProfile from '../pages/employer/company-profile/CompanyProfile';
import MyProfile from '../pages/jobseeker/MyProfile';
import MyCVs from '../pages/jobseeker/MyCVs';
import FindJobs from '../pages/jobseeker/FindJobs';
import PublicFindJobs from '../pages/jobs/PublicFindJobs';
import JobDescription from '../pages/jobs/JobDescription';
import EmployerLayout from '../components/layout/employer/EmployerLayout';
import JobseekerLayout from '../components/layout/jobseeker/JobseekerLayout';
import ApplicationStatus from '../pages/jobseeker/ApplicationStatus';
import SavedJobs from '../pages/jobseeker/SavedJobs';
import LogoutConfirmation from '../pages/auth/LogoutConfirmation';
import ErrorPage from '../pages/error/ErrorPage';
import RoleSelection from '../pages/login/RoleSelection';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: ROUTES.HOME,
                element: <Navigate to="/" replace />,
            },
            {
                path: ROUTES.LOGIN,
                element: <Login />,
            },
            {
                path: ROUTES.REGISTER,
                element: <Signup />,
            },
            {
                path: ROUTES.REGISTER_JOBSEEKER,
                element: <JobseekerSignup />,
            },
            {
                path: ROUTES.REGISTER_EMPLOYER,
                element: <EmployerSignup />,
            },
            {
                path: '/find-jobs',
                element: <PublicFindJobs />,
            },
            {
                path: '/jobs/:id',
                element: <JobDescription />,
            },
            {
                path: ROUTES.CONTACT_US,
                element: <ContactUs />,
            },
            {
                path: ROUTES.PROFILE_SETUP,
                element: <ProfileSetup />,
            },
            {
                path: ROUTES.LOGOUT_CONFIRMATION,
                element: <LogoutConfirmation />,
            },
            {
                path: ROUTES.SSO_ONBOARDING,
                element: <RoleSelection />,
            },
            // Common routes removed from here if they belong to role-specific layouts
        ],
    },
    {
        // Job Seeker specific routes
        element: <JobseekerLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: ROUTES.JOBSEEKER_DASHBOARD,
                element: <JobSeekerDashboard />,
            },
            {
                path: ROUTES.CV_BUILDER,
                element: <CVBuilder />,
            },
            {
                path: ROUTES.JOBSEEKER_FIND_JOBS,
                element: <FindJobs />,
            },
            {
                path: '/jobseeker/jobs/:id',
                element: <JobDescription />,
            },
            {
                path: ROUTES.MY_CVS,
                element: <MyCVs />,
            },
            {
                path: ROUTES.JOBSEEKER_PROFILE,
                element: <MyProfile />,
            },
            {
                path: ROUTES.APPLICATION_STATUS,
                element: <ApplicationStatus />,
            },
            {
                path: ROUTES.SAVED_JOBS,
                element: <SavedJobs />,
            },
            // Future jobseeker routes like /add-cv, /application-status
        ]
    },
    {
        // Employer specific routes
        element: <EmployerLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: ROUTES.EMPLOYER_DASHBOARD,
                element: <EmployerDashboard />,
            },
            {
                path: ROUTES.JOB_MANAGEMENT,
                element: <JobManagement />,
            },
            {
                path: ROUTES.EMPLOYER_APPLICATIONS,
                element: <Applications />,
            },
            {
                path: ROUTES.EMPLOYER_COMPANY_PROFILE,
                element: <CompanyProfile />,
            },
            {
                path: ROUTES.EMPLOYER_HISTORY,
                element: <History />,
            },
            // Future employer routes like /post-job
        ]
    },
    {
        path: ROUTES.NOT_FOUND,
        element: <div className="p-20 text-center">404 Not Found</div>,
    },
]);
