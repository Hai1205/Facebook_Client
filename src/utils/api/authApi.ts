import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/auth";

export const register = async (formData: FormData): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/register`, formData);
};

export const login = async (formData: FormData): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/login`, formData);
};

export const loginGoogle = async (formData: FormData): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/login-google`, formData);
};

export const logout = async (): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/logout`);
};

export const checkAdmin = async (): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/check-admin`)
}

export const sendOTP = async (email: string): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/send-otp/${email}`)
}

export const checkOTP = async (email: string, OTP: string): Promise<any> => {
  const data = new FormData();
    data.append(`OTP`, OTP);
  return await axiosInstance.post(`${endpoint}/check-otp/${email}`, data)
}

export const changePassword = async (userId: string, formData: FormData): Promise<any> => {
  return await axiosInstance.put(`${endpoint}/change-password/${userId}`, formData);
};

export const forgotPassword = async (formData: FormData): Promise<any> => {
  return await axiosInstance.put(`${endpoint}/forgot-password`, formData);
};

export const resetPassword = async (userId: string): Promise<any> => {
  return await axiosInstance.put(`${endpoint}/reset-password/${userId}`);
};