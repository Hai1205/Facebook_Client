import axiosInstance from "../service/axiosInstance";

export const followUser = async (currentUserId: string, opponentId: string): Promise<any> => {
  return await axiosInstance.post(`/api/users/follow-user/${currentUserId}/${opponentId}/`);
};

export const getAllUser = async (): Promise<any> => {
  return await axiosInstance.get(`/api/users/`);
};

export const getUserByRole = async (role: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/get-user-by-role/?role=${role}`);
};

export const getSuggestedUsers = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/get-user-suggested/${userId}/`);
};

export const getUser = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/get-user/${userId}/`);
};

export const getFollowings = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/get-followers/${userId}/`);
};

export const createUser = async (
  formData: FormData
): Promise<any> => {
  return await axiosInstance.post(`/api/users/create-user/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = async (
  userId: string,
  formData: FormData
): Promise<any> => {
  return await axiosInstance.put(`/api/users/update-user/${userId}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUser = async (userId: string): Promise<any> => {
  return await axiosInstance.delete(`/api/users/delete-user/${userId}/`);
};

export const requireUpdateUserToArtist = async (userId: string, formData: FormData): Promise<any> => {
  return await axiosInstance.post(`/api/users/require-update-user-to-artist/${userId}/`, formData);
};

export const responseUpdateUserToArtist = async (userId: string, formData: FormData): Promise<any> => {
  return await axiosInstance.put(`/api/users/response-update-user-to-artist/${userId}/`, formData);
};

export const searchUsers = async (queryString: string): Promise<any> => {
  return await axiosInstance.get(`api/users/search-users/${queryString}`);
}

export const getArtistApplications = async (queryString: string): Promise<any> => {
  return await axiosInstance.get(`api/users/get-artist-applications/${queryString}`);
}

export const getArtistApplication = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`api/users/get-artist-application/${userId}/`);
}

export const deleteArtistApplication = async (applicationId: string): Promise<any> => {
  return await axiosInstance.delete(`api/users/delete-artist-application/${applicationId}/`);
}