import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook to fetch all CVs
 */
export const useGetCVs = (options = {}) => {
    return useQuery({
        queryKey: ["cvs"],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.CV.LIST);
            return response.data.data.cvs;
        },
        ...options
    });
};

/**
 * Hook to upload a new CV
 */
export const usePostUploadCV = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData) => {
            try {
                const response = await api.post(API_ENDPOINTS.CV.UPLOAD, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Failed to upload CV";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            toast.success("CV uploaded successfully!");
            queryClient.invalidateQueries(["cvs"]);
        }
    });
};

/**
 * Hook to delete a CV
 */
export const useDeleteCV = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            try {
                await api.delete(API_ENDPOINTS.CV.DELETE(id));
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Failed to delete CV";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            toast.success("CV deleted successfully");
            queryClient.invalidateQueries(["cvs"]);
        }
    });
};
/**
 * Hook to create a platform CV
 */
export const usePostCreatePlatformCV = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (cvData) => {
            try {
                const response = await api.post(API_ENDPOINTS.CV.GENERATE, cvData);
                return response.data;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Failed to create CV";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            toast.success("CV created successfully!");
            queryClient.invalidateQueries(["cvs"]);
        }
    });
};

/**
 * Hook to update an existing platform CV
 */
export const usePutUpdatePlatformCV = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, cvData }) => {
            try {
                const response = await api.put(API_ENDPOINTS.CV.UPDATE(id), cvData);
                return response.data;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Failed to update CV";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            toast.success("CV updated successfully!");
            queryClient.invalidateQueries(["cvs"]);
        }
    });
};
