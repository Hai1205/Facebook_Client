import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/posts";

export const getAllPost = async (): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/`)
}

export const getAllStory = async (): Promise<any> => {
    return await axiosInstance.get(`${endpoint}/get-all-story`)
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

export const addCommentToPost = async (postId: string, userId: string, text: string): Promise<any> => {
    const formData = new FormData();
    formData.append("text", text);

    return await axiosInstance.post(`${endpoint}/add-comment-to-post/${postId}/${userId}`, formData)
}

export const sharePost = async (postId: string, userId: string): Promise<any> => {
    return await axiosInstance.post(`${endpoint}/share-post/${postId}/${userId}`);
}

// export const likeStory = async(storyId: string, userId: string): Promise<any> => {
//     return await axiosInstance.post(`${endpoint}/like-story/${storyId}/${userId}`)
// }
