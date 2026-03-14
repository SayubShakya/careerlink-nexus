import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import toast from 'react-hot-toast';

/**
 * Hook to get admin dashboard stats
 */
export const useGetAdminStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ADMIN.STATS);
            return response?.data?.data?.stats;
        },
    });
};

/**
 * Hook to get all employers
 */
export const useGetAllEmployers = () => {
    return useQuery({
        queryKey: ['admin', 'employers'],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ADMIN.EMPLOYERS);
            return response?.data?.data?.employers || [];
        },
    });
};

/**
 * Hook to get all jobs
 */
export const useGetAllJobs = () => {
    return useQuery({
        queryKey: ['admin', 'jobs'],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ADMIN.JOBS);
            return response?.data?.data?.jobs || [];
        },
    });
};

/**
 * Hook to get all job seekers
 */
export const useGetAllJobSeekers = () => {
    return useQuery({
        queryKey: ['admin', 'jobSeekers'],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ADMIN.JOB_SEEKERS);
            return response?.data?.data?.jobSeekers || [];
        },
    });
};

/**
 * Hook to delete an employer
 */
export const useDeleteEmployer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (employerId) => {
            const response = await api.delete(API_ENDPOINTS.ADMIN.DELETE_EMPLOYER(employerId));
            return response?.data;
        },
        onSuccess: () => {
            toast.success('Employer removed successfully');
            queryClient.invalidateQueries({ queryKey: ['admin', 'employers'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to remove employer');
        },
    });
};

/**
 * Hook to get jobs by a specific employer
 */
export const useGetEmployerJobs = (employerId) => {
    return useQuery({
        queryKey: ['admin', 'employerJobs', employerId],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ADMIN.EMPLOYER_JOBS(employerId));
            return response?.data?.data;
        },
        enabled: !!employerId,
    });
};
