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
    respondFriendRequest,
    searchUsers,
    sendFriendRequest,
    unFriend,
    updateAvatarPhoto,
    updateCoverPhoto,
    updateUser,
    updateUserBio,
    getFriendRequestStatus,
    getUserProfile
} from "@/utils/api/usersApi";
import { FRIEND_REQUEST, USER } from "@/utils/interface";

interface UserStore {
    suggestedUsers: USER[];
    usersTable: USER[];
    friendRequests: FRIEND_REQUEST[];
    isLoading: boolean;
    error: string | null;
    status: number;
    message: string | null;

    getAllUser: () => Promise<any>;
    getAllFriendsRequest: () => Promise<any>;
    getUser: (userId: string) => Promise<any>;
    getUserProfile: (currentUserId: string, targetUserId: string) => Promise<any>;
    createUser: (formData: FormData) => Promise<any>;
    updateUser: (userId: string, formData: FormData) => Promise<any>;
    updateUserBio: (userId: string, formData: FormData) => Promise<any>;
    updateCoverPhoto: (userId: string, formData: FormData) => Promise<any>;
    updateAvatarPhoto: (userId: string, formData: FormData) => Promise<any>;
    deleteUser: (userId: string) => Promise<any>;
    followUser: (currentUserId: string, opponentId: string) => Promise<any>;
    sendFriendRequest: (currentUserId: string, opponentId: string) => Promise<any>;
    respondFriendRequest: (currentUserId: string, opponentId: string, formData: FormData) => Promise<any>;
    unFriend: (currentUserId: string, opponentId: string) => Promise<any>;
    getSuggestedUsers: (userId: string) => Promise<any>;
    getUserFriendsRequests: (userId: string) => Promise<any>;
    searchUsers: (queryString: string) => Promise<any>;
    getFriendRequestStatus: (currentUserId: string, targetUserId: string) => Promise<any>;
    removeFriendRequest: (friendRequestId: string) => Promise<any>;
    removeSuggestedUser: (userId: string) => Promise<any>;
    removeUserFromTable: (userId: string) => Promise<any>;
    addUserToTable: (user: USER) => Promise<any>;
    updateUserInTable: (updatedUser: USER) => Promise<any>;
    reset: () => void;
}

const initialState = {
    suggestedUsers: [],
    usersTable: [],
    friendRequests: [],
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

                    set({ usersTable: users });
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

                    return response.data;
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

            getUserProfile: async (currentUserId: string, targetUserId: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUserProfile(currentUserId || "NONE", targetUserId);

                    return response.data;
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
                    const { friendRequests } = response.data;

                    set({ friendRequests });
                    return friendRequests;
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
                    await sendFriendRequest(currentUserId, opponentId);

                    return true;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ error: message });

                    toast.error(message);
                    return false;
                }
            },

            respondFriendRequest: async (currentUserId, opponentId, formData: FormData) => {
                set({ error: null });

                try {
                    await respondFriendRequest(currentUserId, opponentId, formData);

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

                    set({ suggestedUsers: users });
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

                    const userAuth = useAuthStore.getState().userAuth;
                    if (userAuth?.id === userId) {
                        useAuthStore.getState().setUserAuth(user);
                    }

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

            searchUsers: async (queryString) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await searchUsers(queryString);
                    const { users } = response.data;

                    if (!users || !Array.isArray(users)) {
                        return [];
                    }

                    set({ usersTable: users });

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

            getFriendRequestStatus: async (currentUserId, targetUserId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getFriendRequestStatus(currentUserId, targetUserId);
                    const { status } = response.data;

                    return status;
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

            removeFriendRequest: async (friendRequestId: string) => {
                set((state) => ({
                    friendRequests: state.friendRequests.filter((request) => request.id !== friendRequestId)
                }));
            },

            removeSuggestedUser: async (userId: string) => {
                set((state) => ({
                    suggestedUsers: state.suggestedUsers.filter((user) => user.id !== userId)
                }));
            },

            removeUserFromTable: async (userId: string) => {
                set((state) => ({
                    usersTable: state.usersTable.filter((user) => user.id !== userId)
                }));
            },

            addUserToTable: async (user: USER) => {
                set((state) => ({
                    usersTable: [user, ...state.usersTable]
                }));
            },

            updateUserInTable: async (updatedUser: USER) => {
                set((state) => ({
                    usersTable: state.usersTable.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user
                    )
                }));
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