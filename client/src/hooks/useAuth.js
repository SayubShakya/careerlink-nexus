import usePostLogin from '@/hooks/api/auth/usePostLogin';
import usePostLogout from '@/hooks/api/auth/usePostLogout';
import usePostRegisterJobSeeker from '@/hooks/api/auth/usePostRegisterJobSeeker';
import usePostRegisterEmployer from '@/hooks/api/auth/usePostRegisterEmployer';

/**
 * Custom hook for authentication logic
 * Wraps the React Query auth hooks for easy access
 */
export const useAuth = () => {
    const loginMutation = usePostLogin();
    const logoutMutation = usePostLogout();
    const registerJobSeekerMutation = usePostRegisterJobSeeker();
    const registerEmployerMutation = usePostRegisterEmployer();

    const getCurrentUser = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem('userToken');
    };

    return {
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        registerJobSeeker: registerJobSeekerMutation.mutateAsync,
        registerEmployer: registerEmployerMutation.mutateAsync,
        getCurrentUser,
        isAuthenticated,
        loading: loginMutation.isPending || logoutMutation.isPending || registerJobSeekerMutation.isPending || registerEmployerMutation.isPending,
        error: loginMutation.error || logoutMutation.error || registerJobSeekerMutation.error || registerEmployerMutation.error
    };
};

export default useAuth;
