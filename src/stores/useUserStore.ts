import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
    followUser,
    searchUsers,
    getSuggestedUsers,
    getArtistApplications,
    deleteArtistApplication,
    getUserByRole,
    createUser,
    getArtistApplication,
} from './../utils/api/usersApi';
import { ArtistApplication, User } from "../utils/types";
import {
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    requireUpdateUserToArtist,
    responseUpdateUserToArtist
} from '@/utils/api/usersApi';
import { useAuthStore } from "./useAuthStore";

interface UserStore {
    isLoading: boolean;
    error: string | null;
    status: number;
    message: string | null;
    user: User | null;
    users: User[];
    artistApplication: ArtistApplication | null;
    artistApplications: ArtistApplication[];

    getAllUser: () => Promise<any>;
    getUserByRole: (role: string) => Promise<any>;
    getUser: (userId: string) => Promise<any>;
    createUser: (formData: FormData) => Promise<any>;
    updateUser: (userId: string, formData: FormData) => Promise<any>;
    deleteUser: (userId: string) => Promise<any>;
    followUser: (currentUserId: string, opponentId: string) => Promise<any>;
    getSuggestedUsers: (userId: string) => Promise<any>;
    requireUpdateUserToArtist: (userId: string, formData: FormData) => Promise<any>;
    responseUpdateUserToArtist: (userId: string, formData: FormData) => Promise<any>;
    searchUsers: (query: string) => Promise<any>;
    getArtistApplications: (status: string) => Promise<any>;
    getArtistApplication: (userId: string) => Promise<any>;
    deleteArtistApplication: (applicationId: string) => Promise<any>;
    reset: () => any;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            artistApplication: null,
            users: [],
            artistApplications: [],
            isLoading: false,
            error: null,
            status: 0,
            message: null,

            getAllUser: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getAllUser();
                    const { users } = response.data;

                    set({ users: users });
                    return users;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ users: [], error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            getUserByRole: async (role) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUserByRole(role);
                    const { users } = response.data

                    return users;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ users: [], error: message });

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

                    set({ user: user });
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

                    const userAuthId = useAuthStore.getState().user?.id;
                    if (userId === userAuthId) {
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
                    set({ user: null, error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            requireUpdateUserToArtist: async (userId, formData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await requireUpdateUserToArtist(userId, formData);
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

            responseUpdateUserToArtist: async (userId, formData: FormData) => {
                set({ error: null });

                try {
                    const response = await responseUpdateUserToArtist(userId, formData);
                    const { message, application } = response.data;

                    toast.success(message);
                    return application;
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

            searchUsers: async (query) => {
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

            getArtistApplications: async (status) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getArtistApplications(status);
                    const { artistApplications } = response.data;

                    return artistApplications;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ users: [], error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            getArtistApplication: async (userId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getArtistApplication(userId);
                    const { artistApplication } = response.data;

                    return artistApplication;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ users: [], error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteArtistApplication: async (applicationId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await deleteArtistApplication(applicationId);
                    const { message } = response.data;

                    toast.success(message);
                    return true;
                } catch (error: any) {
                    console.error(error)
                    const { message } = error.response.data;
                    set({ users: [], error: message });

                    toast.error(message);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            reset: () => {
                set({
                    user: null,
                    users: [],
                    artistApplication: null,
                    artistApplications: [],
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