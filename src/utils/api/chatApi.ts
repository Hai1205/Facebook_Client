import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/chats";
const messageEndpoint = "/api/messages";

export const getOrCreateConversation = async (
    userId: string,
    otherUserId: string
): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-or-create-conversation/${userId}/${otherUserId}`);
};

export const createConversation = async (userId: string,
    otherUserId: string): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/create-conversation/${userId}/${otherUserId}`)
}

export const getUserConversations = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-user-conversations/${userId}`)
}

export const getMessages = async (conversationId: string, userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-messages/${conversationId}/${userId}`)
}

export const getConversation = async (conversationId: string, userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-conversation/${conversationId}/${userId}`)
}

export const getUsersWithConversation = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-user-with-conversation/${userId}`)
}

export const createGroupConversation = async (formData: FormData): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/create-group`, formData)
}

export const addUserToGroup = async (conversationId: string, userId: string): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/add-user-to-group/${conversationId}/${userId}`)
}

export const deleteUserFromGroup = async (conversationId: string, userId: string): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/delete-group/${conversationId}/${userId}`)
}

export const getOnlineUsers = async (): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/online-users`);
}

export const isUserOnline = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/is-user-online/${userId}`);
}

export const sendMessage = async (messageData: any): Promise<any> => {
    return await axiosInstance.post(`${messageEndpoint}`, messageData);
}

export const sendMessageWithFiles = async (formData: FormData): Promise<any> => {
    return await axiosInstance.post(`${messageEndpoint}/send-with-files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const sendMessageWithImages = async (formData: FormData): Promise<any> => {
    return await axiosInstance.post(`${messageEndpoint}/send-with-images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const markMessageAsDeleted = async (messageId: string, userId: string): Promise<any> => {
    return await axiosInstance.post(`${messageEndpoint}/${messageId}/mark-as-deleted?userId=${userId}`);
}