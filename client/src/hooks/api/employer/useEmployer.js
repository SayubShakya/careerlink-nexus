import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import toast from "react-hot-toast";
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
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });
};

/**
 * Hook to fetch jobs posted by current employer
 */
export const useGetEmployerJobs = () => {
    return useQuery({
        queryKey: ["employer", "jobs"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.EMPLOYER.JOBS);
            return response.data.data.jobs;
        }
    });
};

/**
 * Hook to update application status (shortlist/reject/hired)
 */
export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }) => {
            const response = await api.put(`${API_ENDPOINTS.EMPLOYER.APPLICATIONS}/${id}/status`, { status });
            return response.data.data.application;
        },
        onSuccess: (data, variables) => {
            toast.success(`Application status updated to ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ["employer", "applications"] });
            queryClient.invalidateQueries({ queryKey: ["employer", "stats"] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to update application status";
            toast.error(errorMessage);
        }
    });
};

/**
 * Hook to fetch employer stats (total jobs, applications, etc.)
 */
export const useGetEmployerStats = () => {
    return useQuery({
        queryKey: ["employer", "stats"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.EMPLOYER.STATS);
            return response.data.data.stats;
        }
    });
};

/**
 * Hook to fetch company profile
 */
export const useGetCompanyProfile = () => {
    return useQuery({
        queryKey: ["employer", "profile"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.EMPLOYER.COMPANY_GET);
            return response.data.data.company;
        }
    });
};

/**
 * Hook to update company profile
 */
export const useUpdateCompanyProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (companyData) => {
            try {
                const response = await api.put(API_ENDPOINTS.EMPLOYER.COMPANY_UPDATE, companyData);
                return response.data;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Failed to update company profile";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            toast.success("Company profile updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["employer", "profile"] });
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        }
    });
};
