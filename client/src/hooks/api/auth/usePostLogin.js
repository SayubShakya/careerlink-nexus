import { useMutation } from "@tanstack/react-query";
import api from "@/api/client";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ROUTES } from "@/routes/routes";

/**
 * Hook for user login
 */
const usePostLogin = () => {
    const loginMutation = useMutation({
        mutationFn: async (data) => {
            try {
                const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
                return response?.data;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Failed to login";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: (data) => {
            // Store the access token
            if (data?.token) {
                localStorage.setItem("userToken", data.token);
            }
            // Store user info
            if (data?.data?.user) {
                localStorage.setItem("user", JSON.stringify(data.data.user));
            }
            // Store role
            const role = data?.data?.role;
            if (role) {
                localStorage.setItem("role", role);
            }

            // Store login timestamp for session expiry tracking (1 hour auto-logout)
            localStorage.setItem("loginTimestamp", Date.now().toString());

            toast.success("Login successful!");

            // Redirect based on role
            if (role === 'job_seeker') {
                window.location.href = ROUTES.JOBSEEKER_DASHBOARD;
            } else if (role === 'employer') {
                window.location.href = ROUTES.EMPLOYER_DASHBOARD;
            } else if (role === 'admin') {
                window.location.href = ROUTES.ADMIN_DASHBOARD;
            } else {
                window.location.href = ROUTES.HOME;
            }
        },
        onError: (error) => {
            console.error("Login mutation error:", error);
        },
    });

    return loginMutation;
};

export default usePostLogin;
