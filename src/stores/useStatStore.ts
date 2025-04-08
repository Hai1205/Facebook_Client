import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
    GeneralStat,
    Song,
    User,
} from "@/utils/types";
import {
    getGeneralStat,
    getPopularSongsStat,
    getTopArtistsStat,
} from "@/utils/api/statsApi";

interface StatStore {
    generalStat: GeneralStat;
    isLoading: boolean;
    error: string | null;
    status: number;
    message: string | null;
    songs: Song[];
    users: User[];

    getGeneralStat: () => Promise<any>;
    getPopularSongsStat: () => Promise<any>;
    getTopArtistsStat: () => Promise<any>;
    reset: () => void;
}

export const useStatStore = create<StatStore>()(
    persist(
        (set) => ({
            isLoading: false,
            error: null,
            songs: [],
            users: [],
            generalStat: {
                totalSongs: 0,
                totalAlbums: 0,
                totalUsers: 0,
                totalArtists: 0,
            },
            status: 0,
            message: null,

            getGeneralStat: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getGeneralStat();
                    const { generalStat } = response.data;

                    set({ generalStat: generalStat });
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

            getPopularSongsStat: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getPopularSongsStat();
                    const { songs } = response.data;

                    set({ songs: songs });
                    return songs;
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

            getTopArtistsStat: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getTopArtistsStat();
                    const { users } = response.data;

                    set({ users: users });
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
                set({
                    songs: [],
                    users: [],
                    generalStat: {
                        totalSongs: 0,
                        totalAlbums: 0,
                        totalUsers: 0,
                        totalArtists: 0,
                    },
                    isLoading: false,
                    error: null,
                    status: 0,
                    message: null,
                })
            },
        }),

        {
            name: "stat-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);