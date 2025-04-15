import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/notifications";

export const getAllNoti= async(): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/`);
}

export const deleteNoti = async(notiId: string): Promise<any> => {
    return await axiosInstance.delete(`${endpoint}/delete-noti/${notiId}`);
} 

export const deleteUserNotifications = async(userId: string): Promise<any> => {
    return await axiosInstance.delete(`${endpoint}/delete-user-notifications/${userId}`);
}

export const getUserNotifications = async(userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-user-notifications/${userId}`);
}
