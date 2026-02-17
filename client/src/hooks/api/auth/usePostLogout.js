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
                localStorage.removeItem("userToken");
                localStorage.removeItem("user");
                localStorage.removeItem("role");
                queryClient.clear();
            }
        },
        onSuccess: () => {
            toast.success("Logged out successfully");
            window.location.href = '/login';
        }
    });
};

export default usePostLogout;
