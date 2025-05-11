import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/posts";

export const getAllPost = async (): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/`)
}

export const getAllStory = async (): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-all-story`)
}

export const getAllReport = async (): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-all-report`)
}

export const getUserPosts = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-user-posts/${userId}`)
}

export const createPost = async (userId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/create-post/${userId}`, formData)
}

export const createStory = async (userId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/create-story/${userId}`, formData)
}

export const deletePost = async (postId: string): Promise<any> => {
    return await axiosInstance.delete(`${endpoint}/delete-post/${postId}`)
}

export const deleteStory = async (storyId: string): Promise<any> => {
    return await axiosInstance.delete(`${endpoint}/delete-story/${storyId}`)
}

export const likePost = async (postId: string, userId: string): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/like-post/${postId}/${userId}`)
}

export const commentPost = async (postId: string, userId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/comment-post/${postId}/${userId}`, formData)
}

export const deleteComment = async (commentId: string, postId: string): Promise<any> => {
    return await axiosInstance.delete(`${endpoint}/delete-comment/${commentId}/${postId}`)
}

export const sharePost = async (postId: string, userId: string): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/share-post/${postId}/${userId}`);
}

export const updatePost = async (postId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.put(`${endpoint}/update-post/${postId}`, formData);
}

export const getUserFeed = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-user-feed/${userId}`);
}

export const getUserStoryFeed = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-user-story-feed/${userId}`);
}

export const searchPosts = async (query: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/search-posts${query}`);
}

export const report = async (userId: string, contentId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/report/${userId}/${contentId}`, formData);
}

export const resolveReport = async (reportId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/resolve-report/${reportId}`, formData);
}

export const deleteReport = async (reportId: string): Promise<any> => {
    return await axiosInstance.delete(`${endpoint}/delete-report/${reportId}`);
}

export const searchReports = async (query: string): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/search-reports${query}`);
}


