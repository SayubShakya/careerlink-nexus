import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook to fetch current user profile
 */
export const useGetMe = () => {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.AUTH.ME);
            return response.data.data;
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
