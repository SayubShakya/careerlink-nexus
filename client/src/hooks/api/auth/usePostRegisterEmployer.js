import { useMutation } from "@tanstack/react-query";
import api from "@/api/client";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Hook for registering an Employer
 */
const usePostRegisterEmployer = () => {
    return useMutation({
        mutationFn: async (userData) => {
            try {
                // Frontend keys now match backend model directly
                const payload = {
                    companyName: userData.companyName,
                    companyWebsite: userData.companyWebsite,
                    email: userData.email,
                    password: userData.password
                };
                const response = await api.post(API_ENDPOINTS.AUTH.REGISTER_EMPLOYER, payload);
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

export default usePostRegisterEmployer;
