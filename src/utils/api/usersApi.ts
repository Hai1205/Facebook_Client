import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/users";

export const followUser = async (currentUserId: string, opponentId: string): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/follow-user/${currentUserId}/${opponentId}`);
};

export const getAllUser = async (): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/`);
};

export const getSuggestedUsers = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user-suggested/${userId}`);
};

export const getUser = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user/${userId}`);
};

export const getUserProfile = async (currentUserId: string, targetUserId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user-profile/${currentUserId}/${targetUserId}`);
};

export const getUserFriendsRequests = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user-friend-request/${userId}`);
};

export const createUser = async (
  formData: FormData
): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/create-user`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = async (
  userId: string,
  formData: FormData
): Promise<any> => {
  return await axiosInstance.put(`${endpoint}/update-user/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUserBio = async (
  userId: string,
  formData: FormData
): Promise<any> => {
  return await axiosInstance.put(`${endpoint}/update-user-bio/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCoverPhoto = async (
  userId: string,
  formData: FormData
): Promise<any> => {
  return await axiosInstance.put(`${endpoint}/update-cover-photo/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateAvatarPhoto = async (
  userId: string,
  formData: FormData
): Promise<any> => {
  return await axiosInstance.put(`${endpoint}/update-avatar-photo/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUser = async (userId: string): Promise<any> => {
  return await axiosInstance.delete(`${endpoint}/delete-user/${userId}`);
};

export const searchUsers = async (queryString: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/search-users${queryString}`);
};

export const sendFriendRequest = async (
  currentUserId: string,
  opponentId: string
): Promise<any> => {
  return await axiosInstance.post(
    `${endpoint}/send-friend-request/${currentUserId}/${opponentId}`
  );
};

export const unFriend = async (
  currentUserId: string,
  opponentId: string
): Promise<any> => {
  return await axiosInstance.post(
    `${endpoint}/unfriend/${currentUserId}/${opponentId}`
  );
};

export const respondFriendRequest = async (
  currentUserId: string,
  opponentId: string,
  formData: FormData
): Promise<any> => {
  return await axiosInstance.post(
    `${endpoint}/respond-friend-request/${currentUserId}/${opponentId}`,
    formData
  );
};

export const getAllFriendsRequest = async (): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-all-friend-request`);
};

export const getFriendRequestStatus = async (currentUserId: string, targetUserId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/friend-request-status/${currentUserId}/${targetUserId}`);
};