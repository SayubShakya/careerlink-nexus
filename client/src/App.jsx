import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/index';
import '@/styles/variables.css';
import '@/styles/global.css';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import SessionManager from '@/components/SessionManager';

const queryClient = new QueryClient();

function App() {
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
