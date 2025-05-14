import { countUnreadMessages, generateBotResponse, getContacts, getConversation, getLatestMessages } from "@/utils/api/messageApi";
import { USER } from "@/utils/interface";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MessageStore {
    contacts: USER[],
    isLoading: boolean;
    error: string | null;
    status: number;
    message: string | null;

    getConversation: (user1Id: string,
        user2Id: string) => Promise<any>;
    getContacts: (userId: string) => Promise<any>;
    getLatestMessages: (userId: string) => Promise<any>;
    countUnreadMessages: (userId: string) => Promise<any>;
    generateBotResponse: (text: string) => Promise<any>;
    reset: () => void;
}

const initialState = {
    contacts: [],
    isLoading: false,
    error: null,
    status: 0,
    message: null,
}

export const useMessageStore = create<MessageStore>()(
    persist(
        (set) => ({
            ...initialState,

            getConversation: async (user1Id: string,
                user2Id: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getConversation(user1Id,
                        user2Id);
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

            getContacts: async (userId: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getContacts(userId);
                    const { users } = response.data;

                    set({ contacts: users });
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
            
            generateBotResponse: async (text: string) => {
                set({ isLoading: true, error: null });

                try {
                  return await generateBotResponse(text);
                } catch (error: any) {
                    console.error(error)
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