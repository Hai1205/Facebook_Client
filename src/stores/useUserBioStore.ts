import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
    updateAvatarPhoto,
    updateCoverPhoto,
    updateUserBio
} from "@/utils/api/userBiosApi";

export interface UserBioStore {
    status: number;
    message: string | null;
    isLoading: boolean;
    error: string | null;

    updateUserBio: (userId: string, formData: FormData) => Promise<any>;
    updateCoverPhoto: (userId: string, formData: FormData) => Promise<any>;
    updateAvatarPhoto: (userId: string, formData: FormData) => Promise<any>;
    reset: () => any;
}

const initialState = {
    status: 0,
    message: null,
    isLoading: false,
    error: null,
}

export const useUserBioStore = create<UserBioStore>()(
    persist(
        (set) => ({
            ...initialState,

            updateUserBio: async (userId: string, formData: FormData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await updateUserBio(userId, formData);
                    const { userBio } = response.data;

                    return userBio;
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

            updateCoverPhoto: async (userId: string, formData: FormData) => {
                set({ isLoading: true, error: null });

                try {
                    await updateCoverPhoto(userId, formData);

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

            updateAvatarPhoto: async (userId: string, formData: FormData) => {
                set({ isLoading: true, error: null });

                try {
                    await updateAvatarPhoto(userId, formData);

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

            reset: () => { set({ ...initialState }); },
        }),

        {
            name: "user-bio-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);


