import { getGeneralStat, getPopularPostStat, getTopUsersStat } from "@/utils/api/statsApi";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


interface StatStore {
    isLoading: boolean;
    error: string | null;
    status: number;
    message: string | null;

    getGeneralStat: () => Promise<any>;
    getPopularPostStat: () => Promise<any>;
    getTopUsersStat: () => Promise<any>;
    reset: () => void;
}

const initialState = {
	isLoading: false,
	error: null,
	status: 0,
	message: null,
}

export const useStatStore = create<StatStore>()(
    persist(
        (set) => ({
            ...initialState,

            getGeneralStat: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getGeneralStat();
                    const { generalStat } = response.data;

                    return generalStat;
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

            getPopularPostStat: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getPopularPostStat();
                    const { posts } = response.data;

                    return posts;
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

            getTopUsersStat: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getTopUsersStat();
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

            reset: () => { set({ ...initialState }); },
        }),

        {
            name: "stat-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);