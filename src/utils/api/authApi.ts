import axiosInstance from "../service/axiosInstance";

export const register = async (formData: FormData): Promise<any> => {
  return await axiosInstance.post("/api/auth/register/", formData);
};

export const registerAdmin = async (formData: FormData): Promise<any> => {
  return await axiosInstance.post("/api/auth/register-admin/", formData);
};

export const login = async (formData: FormData): Promise<any> => {
  return await axiosInstance.post("/api/auth/login/", formData);
};

export const loginWithGoogle = async (formData: FormData): Promise<any> => {
  return await axiosInstance.post("/api/auth/login-with-google/", formData);
};

export const logout = async (): Promise<any> => {
  return await axiosInstance.post("/api/auth/logout/");
};

export const refreshToken = async (): Promise<any> => {
  return await axiosInstance.post("/api/auth/refresh-token/")
}

export const checkAdmin = async (): Promise<any> => {
  return await axiosInstance.post("/api/auth/check-admin/")
}

export const checkArtist = async (): Promise<any> => {
  return await axiosInstance.post("/api/auth/check-artist/")
}

export const sendOTP = async (email: string): Promise<any> => {
  return await axiosInstance.post(`/api/auth/send-otp/${email}/`)
}

export const checkOTP = async (email: string, OTP: string): Promise<any> => {
  const data = new FormData();
    data.append("OTP", OTP);
  return await axiosInstance.post(`/api/auth/check-otp/${email}/`, data)
}

export const changePassword = async (userId: string, formData: FormData): Promise<any> => {
  return await axiosInstance.put(`/api/auth/change-password/${userId}/`, formData);
};

export const forgotPassword = async (formData: FormData): Promise<any> => {
  return await axiosInstance.put(`/api/auth/forgot-password/`, formData);
};

export const resetPassword = async (userId: string): Promise<any> => {
  return await axiosInstance.put(`/api/auth/reset-password/${userId}/`);
};