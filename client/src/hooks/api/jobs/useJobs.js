import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook to fetch all jobs or filtered jobs
 */
export const useGetJobs = (params = {}) => {
    return useQuery({
        queryKey: ["jobs", params],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.JOBS.LIST, { params });
            return response.data.data.jobs;
        }
    });
};

/**
 * Hook to fetch single job details
 */
export const useGetJobDetails = (id) => {
    return useQuery({
        queryKey: ["jobs", id],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.JOBS.DETAILS(id));
            return response.data.data.job;
        },
        enabled: !!id
    });
};
