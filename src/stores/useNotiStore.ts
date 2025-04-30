import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { deleteNoti, deleteUserNotifications, getAllNoti, getUserNotifications } from "@/utils/api/notiApi";

export interface NotiStore {
    status: number;
    message: string | null;
    isLoading: boolean;
    error: string | null;

    getAllNoti: () => Promise<any>;
    deleteNoti: (notiId: string) => Promise<any>;
    deleteUserNotifications: (userId: string) => Promise<any>;
    getUserNotifications: (userId: string) => Promise<any>;
    reset: () => any;
}

const initialState = {
    status: 0,
    message: null,
    isLoading: false,
    error: null,
}

export const useNotiStore = create<NotiStore>()(
    persist(
        (set) => ({
            ...initialState,

            getAllNoti: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getAllNoti();
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

            deleteNoti: async (notiId: string) => {
                set({ isLoading: true, error: null });

                try {
                    await deleteNoti(notiId);

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

            deleteUserNotifications: async (notiId: string) => {
                set({ isLoading: true, error: null });

                try {
                    await deleteUserNotifications(notiId);

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

            getUserNotifications: async (userId: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUserNotifications(userId);
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
            name: "notification-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);


