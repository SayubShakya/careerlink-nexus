import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook to fetch personal profile (as job seeker)
 */
export const useGetProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.PROFILE.GET);
            return response.data.data.user;
        }
    });
};

/**
 * Hook to update profile
 */
export const usePutUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (profileData) => {
            try {
                const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE, profileData);
                return response.data;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Failed to update profile";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: (data) => {
            toast.success("Profile updated successfully!");
            queryClient.invalidateQueries(["profile"]);
            queryClient.invalidateQueries(["auth", "me"]);
            // Update local storage if needed
            if (data?.data?.user) {
                localStorage.setItem("user", JSON.stringify(data.data.user));
            }
        }
    });
};
