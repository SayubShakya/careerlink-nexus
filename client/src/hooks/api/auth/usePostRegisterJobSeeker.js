import { useMutation } from "@tanstack/react-query";
import api from "@/api/client";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook for registering a Job Seeker
 */
const usePostRegisterJobSeeker = () => {
    return useMutation({
        mutationFn: async (userData) => {
            try {
                // Map frontend fields to backend fields
                const payload = {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    email: userData.email,
                    password: userData.password
                };
                const response = await api.post(API_ENDPOINTS.AUTH.REGISTER_JOB_SEEKER, payload);
                return response?.data;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Registration failed";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            toast.success("Registration successful! Please login.");
        }
    });
};

export default usePostRegisterJobSeeker;
