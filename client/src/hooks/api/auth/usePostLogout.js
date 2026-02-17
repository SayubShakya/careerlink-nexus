import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook for user logout
 */
const usePostLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            try {
                await api.post(API_ENDPOINTS.AUTH.LOGOUT);
            } catch (error) {
                console.error("Logout API error:", error);
            } finally {
                // Always clear local state even if server-side logout fails
                localStorage.removeItem("userToken");
                localStorage.removeItem("user");
                localStorage.removeItem("role");
                queryClient.clear();
            }
        },
        onSettled: () => {
            // Use window.location.href for a full app reset on logout
            window.location.href = '/login';
        },
        onSuccess: () => {
            toast.success("Logged out successfully");
        }
    });
};

export default usePostLogout;
