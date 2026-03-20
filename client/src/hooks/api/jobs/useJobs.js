import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

/**
 * Hook to create a new job
 */
export const useCreateJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (jobData) => {
            const response = await api.post(API_ENDPOINTS.JOBS.CREATE, jobData);
            return response.data.data.job;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            // Also refresh employer-specific job list
            queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] });
            queryClient.invalidateQueries({ queryKey: ["employer", "stats"] });
        }
    });
};

/**
 * Hook to update an existing job
 */
export const useUpdateJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, jobData }) => {
            const response = await api.put(API_ENDPOINTS.JOBS.UPDATE(id), jobData);
            return response.data.data.job;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            if (data?.id) queryClient.invalidateQueries({ queryKey: ["jobs", data.id] });
            // Also refresh employer-specific job list
            queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] });
            queryClient.invalidateQueries({ queryKey: ["employer", "stats"] });
        }
    });
};

/**
 * Hook to delete a job
 */
export const useDeleteJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await api.delete(API_ENDPOINTS.JOBS.DELETE(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            // Also refresh employer-specific job list
            queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] });
            queryClient.invalidateQueries({ queryKey: ["employer", "stats"] });
        }
    });
};

/**
 * Hook to fetch jobs applied by current job seeker
 */
export const useGetAppliedJobs = () => {
    return useQuery({
        queryKey: ["applied-jobs"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.PROFILE.MY_APPLICATIONS);
            return response.data.data.applications;
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};

/**
 * Hook to fetch jobs saved by current job seeker
 */
export const useGetSavedJobs = () => {
    return useQuery({
        queryKey: ["saved-jobs"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.PROFILE.SAVED_JOBS);
            return response.data.data.savedJobs;
        }
    });
};

/**
 * Hook to save a job
 */
export const useSaveJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await api.post(API_ENDPOINTS.PROFILE.SAVE_JOB(id));
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
        }
    });
};

/**
 * Hook to unsave a job
 */
export const useUnsaveJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(API_ENDPOINTS.PROFILE.UNSAVE_JOB(id));
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
        }
    });
};

/**
 * Hook to fetch Global Platform Stats (Live Jobs, Vacancies, etc)
 */
export const useGetGlobalStats = () => {
    return useQuery({
        queryKey: ["global-stats"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.JOBS.STATS);
            return response.data.data;
        }
    });
};
