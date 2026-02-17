import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/index';
import '@/styles/variables.css';
import '@/styles/global.css';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
