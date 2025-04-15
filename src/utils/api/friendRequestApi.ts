import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/friend-requests";

export const getAllFriendRequest= async(): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/`);
}

export const deleteFriendRequest = async(friendRequestId: string): Promise<any> => {
    return await axiosInstance.delete(`${endpoint}/delete-friend-request/${friendRequestId}`);
} 

export const deleteUserFriendRequests = async(userId: string): Promise<any> => {
    return await axiosInstance.delete(`${endpoint}/delete-user-friend-requests/${userId}`);
}

export const getUserFriendRequests = async(userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-user-friend-requests/${userId}`);
}
