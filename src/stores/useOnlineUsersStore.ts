import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OnlineUsersStore {
    onlineUsers: string[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setOnlineUsers: (users: string[]) => void;
    addOnlineUser: (userId: string) => void;
    removeOnlineUser: (userId: string) => void;
    reset: () => void;
}

const initialState = {
    onlineUsers: [],
    isLoading: false,
    error: null,
};

export const useOnlineUsersStore = create<OnlineUsersStore>()(
    persist(
        (set) => ({
            ...initialState,

            setOnlineUsers: (users) =>
                set({ onlineUsers: users }),

            addOnlineUser: (userId) =>
                set((state) => {
                    if (state.onlineUsers.includes(userId)) {
                        return state;
                    }
                    return { onlineUsers: [...state.onlineUsers, userId] };
                }),

            removeOnlineUser: (userId) =>
                set((state) => ({
                    onlineUsers: state.onlineUsers.filter((id) => id !== userId)
                })),

            reset: () => set({ ...initialState })
        }),
        {
            name: "online-users-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 