import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook to apply for a job
 */
export const usePostApplyJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ jobId, applicationData }) => {
            try {
                const response = await api.post(API_ENDPOINTS.JOBS.APPLY(jobId), applicationData);
                return response.data;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Failed to apply for job";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            toast.success("Application submitted successfully!");
            queryClient.invalidateQueries(["jobs"]);
            queryClient.invalidateQueries(["employer", "applications"]);
        }
    });
};
