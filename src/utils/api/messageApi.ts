import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/messages";

export const getConversation = async (
    user1Id: string,
    user2Id: string
): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-conversation/${user1Id}/${user2Id}`);
};

export const getContacts = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-contacts/${userId}`)
}

export const getLatestMessages = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-latest-messages/${userId}`)
}

export const countUnreadMessages = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-unread-messages/${userId}`)
}