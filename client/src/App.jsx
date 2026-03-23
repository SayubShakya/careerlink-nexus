import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/index';
import '@/styles/variables.css';
import '@/styles/global.css';
import '@/styles/Responsive.css';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import SessionManager from '@/components/SessionManager';

const queryClient = new QueryClient();

// Helper to get title based on path
const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/find-jobs') || pathname.startsWith('/jobseeker/find-jobs')) return 'Find Jobs';
  if (pathname.includes('/jobseeker/overview') || pathname.includes('/dashboard/employer') || pathname.includes('/admin/dashboard')) return 'Dashboard';
  if (pathname.includes('/cv-builder')) return 'CV Builder';
  if (pathname.includes('/my-cvs')) return 'My CVs';
  if (pathname.includes('/profile') || pathname.includes('/company-profile')) return 'Profile';
  if (pathname.includes('/status') || pathname.includes('/applications')) return 'Applications';
  if (pathname.includes('/saved-jobs')) return 'Saved Jobs';
  if (pathname.includes('/job-management')) return 'Manage Jobs';
  if (pathname.includes('/login')) return 'Login';
  if (pathname.includes('/register') || pathname.includes('/signup')) return 'Sign Up';
  if (pathname.includes('/admin/employers')) return 'Employers';
  if (pathname.includes('/admin/job-seekers')) return 'Job Seekers';
  if (pathname.includes('/admin/jobs')) return 'Jobs Overview';
  if (pathname.startsWith('/jobs/') || pathname.startsWith('/jobseeker/jobs/')) return 'Job Details';
  
  return '';
};

function App() {
  useEffect(() => {
    // Initial title set based on the current location location
    const updateTitle = (pathname) => {
      const pageName = getPageTitle(pathname);
      document.title = pageName ? `CareerLink | ${pageName}` : 'CareerLink';
    };

    updateTitle(router.state.location.pathname);

    // Subscribe to router state changes
    const unsubscribe = router.subscribe((state) => {
      updateTitle(state.location.pathname);
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionManager />
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
