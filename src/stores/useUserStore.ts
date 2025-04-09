import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { createUser, deleteUser, deleteUserFromRequests, followUser, getAllUser, getSuggestedUsers, getUser, getUserForRequest, getUserFriendsRequests, getUserMutualFriends, updateUser } from "@/utils/api/usersApi";

interface UserStore {
    isLoading: boolean;
    error: string | null;
    status: number;
    message: string | null;

    getAllUser: () => Promise<any>;
    getUser: (userId: string) => Promise<any>;
    createUser: (formData: FormData) => Promise<any>;
    updateUser: (userId: string, formData: FormData) => Promise<any>;
    deleteUser: (userId: string) => Promise<any>;
    followUser: (currentUserId: string, opponentId: string) => Promise<any>;
    getSuggestedUsers: (userId: string) => Promise<any>;
    getUserForRequest: (userId: string) => Promise<any>;
    getUserFriendsRequests: (userId: string) => Promise<any>;
    getUserMutualFriends: (userId: string) => Promise<any>;
    deleteUserFromRequests: (currentUserId: string, requestSenderId: string) => Promise<any>;
    reset: () => any;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            isLoading: false,
            error: null,
            status: 0,
            message: null,

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

            getUserForRequest: async (userId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUserForRequest(userId);
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

            getUserMutualFriends: async (userId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUserMutualFriends(userId);
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
                set({ error: null });

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
            
            deleteUserFromRequests: async (currentUserId: string, requestSenderId: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await deleteUserFromRequests(currentUserId, requestSenderId);
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

            reset: () => {
                set({
                    isLoading: false,
                    error: null,
                    status: 0,
                    message: null,
                });
            },
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);