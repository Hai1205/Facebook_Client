import axiosInstance from "../service/axiosInstance";

const endpoint = "/api/users";

export const followUser = async (currentUserId: string, opponentId: string): Promise<any> => {
  return await axiosInstance.post(`${endpoint}/follow-user/${currentUserId}/${opponentId}`);
};

export const getAllUser = async (): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/`);
};

export const getSuggestedUsers = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user-suggested/${userId}/`);
};

export const getUser = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user/${userId}`);
};

export const getUserForRequest = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user-for-request/${userId}`);
};

export const getUserFriendsRequests = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user-friend-request/${userId}`);
};

export const getUserMutualFriends = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`${endpoint}/get-user-mutual-friends/${userId}`);
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

export const deleteUser = async (userId: string): Promise<any> => {
  return await axiosInstance.delete(`${endpoint}/delete-user/${userId}`);
};

export const deleteUserFromRequests = async (currentUserId: string, requestSenderId: string): Promise<any> => {
  return await axiosInstance.delete(`${endpoint}/delete-user-from-requests/${currentUserId}/${requestSenderId}`);
};

// export const getFollowings = async (userId: string): Promise<any> => {
//   return await axiosInstance.get(`${endpoint}/get-followers/${userId}/`);
// };

// export const getUserByRole = async (role: string): Promise<any> => {
//   return await axiosInstance.get(`${endpoint}/get-user-by-role/?role=${role}`);
// };

// export const requireUpdateUserToArtist = async (userId: string, formData: FormData): Promise<any> => {
//   return await axiosInstance.post(`${endpoint}/require-update-user-to-artist/${userId}/`, formData);
// };

// export const responseUpdateUserToArtist = async (userId: string, formData: FormData): Promise<any> => {
//   return await axiosInstance.put(`${endpoint}/response-update-user-to-artist/${userId}/`, formData);
// };

// export const searchUsers = async (queryString: string): Promise<any> => {
//   return await axiosInstance.get(`${endpoint}/search-users/${queryString}`);
// }

// export const getArtistApplications = async (queryString: string): Promise<any> => {
//   return await axiosInstance.get(`${endpoint}/get-artist-applications/${queryString}`);
// }

// export const getArtistApplication = async (userId: string): Promise<any> => {
//   return await axiosInstance.get(`${endpoint}/get-artist-application/${userId}/`);
// }

// export const deleteArtistApplication = async (applicationId: string): Promise<any> => {
//   return await axiosInstance.delete(`${endpoint}/delete-artist-application/${applicationId}/`);
// }