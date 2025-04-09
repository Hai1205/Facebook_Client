import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/user-bios";

export const updateUserBio = async(userId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.put(`${endpoint}/update-user-bio/${userId}`, formData);
} 

export const updateCoverPhoto = async(userId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.put(`${endpoint}/update-cover-photo/${userId}`, formData);
}

export const updateAvatarPhoto = async(userId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.put(`${endpoint}/update-avatar-photo/${userId}`, formData);
}