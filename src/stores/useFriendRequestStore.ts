import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { deleteFriendRequest, deleteUserFriendRequests, getAllFriendRequest, getUserFriendRequests } from "@/utils/api/friendRequestApi";

export interface FriendRequestStore {
    status: number;
    message: string | null;
    isLoading: boolean;
    error: string | null;

    getAllFriendRequest: () => Promise<any>;
    deleteFriendRequest: (friendRequestId: string) => Promise<any>;
    deleteUserFriendRequests: (userId: string) => Promise<any>;
    getUserFriendRequests: (userId: string) => Promise<any>;
    reset: () => any;
}

const initialState = {
    status: 0,
    message: null,
    isLoading: false,
    error: null,
}

export const useFriendRequestStore = create<FriendRequestStore>()(
    persist(
        (set) => ({
            ...initialState,

            getAllFriendRequest: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getAllFriendRequest();
                    const { notifications } = response.data;

                    return notifications;
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

            deleteFriendRequest: async (notiId: string) => {
                set({ isLoading: true, error: null });

                try {
                    await deleteFriendRequest(notiId);

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

            deleteUserFriendRequests: async (notiId: string) => {
                set({ isLoading: true, error: null });

                try {
                    await deleteUserFriendRequests(notiId);

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

            getUserFriendRequests: async (userId: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUserFriendRequests(userId);
                    const { notifications } = response.data;

                    return notifications;
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

            reset: () => { set({ ...initialState }); },
        }),

        {
            name: "friend-request-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);


