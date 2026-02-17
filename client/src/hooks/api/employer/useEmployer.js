import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook to fetch applications received by employer
 */
export const useGetEmployerApplications = () => {
    return useQuery({
        queryKey: ["employer", "applications"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.EMPLOYER.APPLICATIONS);
            return response.data.data.applications;
        }
    });
};
