import { countUnreadMessages, getContacts, getConversation, getLatestMessages } from "@/utils/api/messageApi";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StatStore {
    isLoading: boolean;
    error: string | null;
    status: number;
    message: string | null;

    getConversation: (user1Id: string,
        user2Id: string) => Promise<any>;
    getContacts: (userId: string) => Promise<any>;
    getLatestMessages: (userId: string) => Promise<any>;
    countUnreadMessages: (userId: string) => Promise<any>;
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

            getConversation: async (user1Id: string,
                user2Id: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getConversation(user1Id,
                        user2Id);
                    const { conversation } = response.data;

                    return conversation;
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

            getContacts: async (userId: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getContacts(userId);
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

            getLatestMessages: async (userId: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getLatestMessages(userId);
                    const { messageResponses } = response.data;

                    return messageResponses;
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

            countUnreadMessages: async (userId: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await countUnreadMessages(userId);
                    const { unRead } = response.data;

                    return unRead;
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
            name: "message-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);