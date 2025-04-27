import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import {
    createUser,
    deleteUser,
    followUser,
    getAllFriendsRequest,
    getAllUser,
    getSuggestedUsers,
    getUser,
    getUserFriendsRequests,
    responseFriendRequest,
    searchUsers,
    sendFriendRequest,
    unFriend,
    updateAvatarPhoto,
    updateCoverPhoto,
    updateUser,
    updateUserBio
} from "@/utils/api/usersApi";

interface UserStore {
    isLoading: boolean;
    error: string | null;
    status: number;
    message: string | null;

    getAllUser: () => Promise<any>;
    getAllFriendsRequest: () => Promise<any>;
    getUser: (userId: string) => Promise<any>;
    createUser: (formData: FormData) => Promise<any>;
    updateUser: (userId: string, formData: FormData) => Promise<any>;
    updateUserBio: (userId: string, formData: FormData) => Promise<any>;
    updateCoverPhoto: (userId: string, formData: FormData) => Promise<any>;
    updateAvatarPhoto: (userId: string, formData: FormData) => Promise<any>;
    deleteUser: (userId: string) => Promise<any>;
    followUser: (currentUserId: string, opponentId: string) => Promise<any>;
    sendFriendRequest: (currentUserId: string, opponentId: string) => Promise<any>;
    responseFriendRequest: (currentUserId: string, opponentId: string) => Promise<any>;
    unFriend: (currentUserId: string, opponentId: string) => Promise<any>;
    getSuggestedUsers: (userId: string) => Promise<any>;
    getUserFriendsRequests: (userId: string) => Promise<any>;
    searchUsers: (query: string) => Promise<any>;
    reset: () => any;
}

const initialState = {
    isLoading: false,
    error: null,
    status: 0,
    message: null,
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            ...initialState,

            getAllUser: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getAllUser();
                    const { users } = response.data;

                    return users;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            getAllFriendsRequest: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getAllFriendsRequest();
                    const { users } = response.data;

                    return users;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            getUser: async (userId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUser(userId);
                    const { user } = response.data;

                    return user;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            getUserFriendsRequests: async (userId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUserFriendsRequests(userId);
                    const { user } = response.data;

                    return user;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            followUser: async (currentUserId, opponentId) => {
                set({ error: null });

                try {
                    const response = await followUser(currentUserId, opponentId);
                    const { user, message } = response.data;

                    useAuthStore.getState().setUserAuth(user);
                    toast.success(message);
                    return user;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                }
            },
           
            sendFriendRequest: async (currentUserId, opponentId) => {
                set({ error: null });

                try {
                    const response = await sendFriendRequest(currentUserId, opponentId);
                    const { message } = response.data;

                    toast.success(message);
                    return true;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                }
            },
           
            responseFriendRequest: async (currentUserId, opponentId) => {
                set({ error: null });

                try {
                    const response = await responseFriendRequest(currentUserId, opponentId);
                    const { message } = response.data;

                    toast.success(message);
                    return true;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                }
            },
            
            unFriend: async (currentUserId, opponentId) => {
                set({ error: null });

                try {
                    const response = await unFriend(currentUserId, opponentId);
                    const { message } = response.data;

                    toast.success(message);
                    return true;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                }
            },

            getSuggestedUsers: async (userId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getSuggestedUsers(userId);
                    const { users } = response.data;

                    return users;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            createUser: async (formData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await createUser(formData);
                    const { message, user } = response.data;

                    toast.success(message);
                    return user;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateUser: async (userId, formData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await updateUser(userId, formData);
                    const { user, message } = response.data;

                    useAuthStore.getState().setUserAuth(user);
                    toast.success(message);
                    return user;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },
            
            updateUserBio: async (userId, formData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await updateUserBio(userId, formData);
                    const { user, message } = response.data;

                    useAuthStore.getState().setUserAuth(user);
                    toast.success(message);
                    return user;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateCoverPhoto: async (userId, formData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await updateCoverPhoto(userId, formData);
                    const { user, message } = response.data;

                    useAuthStore.getState().setUserAuth(user);
                    toast.success(message);
                    return user;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },
           
            updateAvatarPhoto: async (userId, formData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await updateAvatarPhoto(userId, formData);
                    const { user, message } = response.data;

                    useAuthStore.getState().setUserAuth(user);
                    toast.success(message);
                    return user;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteUser: async (userId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await deleteUser(userId);
                    const { message } = response.data;

                    toast.success(message);
                    return true;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            searchUsers: async (query: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await searchUsers(query);
                    const { users } = response.data;

                    return users;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            reset: () => {
                set({ ...initialState });
            },
        }),

        {
            name: "user-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);