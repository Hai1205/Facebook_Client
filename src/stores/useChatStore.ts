import {
  addUserToGroup,
  chatAI,
  createConversation,
  createGroupConversation,
  deleteUserFromGroup,
  getConversation,
  getMessages,
  getOrCreateConversation,
  getUserConversations,
  getUsersWithConversation,
} from "@/utils/api/chatApi";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatStore {
  isLoading: boolean;
  error: string | null;
  status: number;
  message: string | null;

  // WebSocket state
  isWebSocketConnected: boolean;
  currentUserId: string | null;
  currentConversation: any | null;
  messages: any[];
  conversations: any[];

  // WebSocket actions
  setWebSocketConnected: (isConnected: boolean) => void;
  addMessage: (message: any) => void;
  updateConversationWithLatestMessage: (message: any) => void;
  markMessagesAsRead: (data: {
    conversationId: string;
    userId: string;
  }) => void;
  setCurrentConversation: (conversation: any) => void;
  setCurrentUserId: (userId: string) => void;
  setMessages: (messages: any[]) => void;
  setConversations: (conversations: any[]) => void;

  getOrCreateConversation: (
    userId: string,
    otherUserId: string
  ) => Promise<any>;
  createConversation: (userId: string, otherUserId: string) => Promise<any>;
  getUserConversations: (userId: string) => Promise<any>;
  getMessages: (conversationId: string, userId: string) => Promise<any>;
  getConversation: (conversationId: string, userId: string) => Promise<any>;
  getUsersWithConversation: (userId: string) => Promise<any>;
  createGroupConversation: (formData: FormData) => Promise<any>;
  addUserToGroup: (conversationId: string, userId: string) => Promise<any>;
  deleteUserFromGroup: (conversationId: string, userId: string) => Promise<any>;
  chatAI: (prompt: string) => Promise<any>;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  error: null,
  status: 0,
  message: null,

  // WebSocket initial state
  isWebSocketConnected: false,
  currentUserId: null,
  currentConversation: null,
  messages: [],
  conversations: [],
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // WebSocket actions
      setWebSocketConnected: (isConnected: boolean) =>
        set({ isWebSocketConnected: isConnected }),

      addMessage: (message: any) => {
        const messages = get().messages;
        const messageExists = messages.some((m) => m.id === message.id);
        if (!messageExists) {
          set({ messages: [...messages, message] });
        }
      },

      updateConversationWithLatestMessage: (message: any) => {
        const conversations = get().conversations;
        const updatedConversations = conversations.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message,
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        });
        set({ conversations: updatedConversations });
      },

      markMessagesAsRead: (data: {
        conversationId: string;
        userId: string;
      }) => {
        const { conversationId, userId } = data;
        const messages = get().messages;
        const updatedMessages = messages.map((msg) => {
          if (
            msg.conversationId === conversationId &&
            !msg.readBy.includes(userId)
          ) {
            return {
              ...msg,
              readBy: [...msg.readBy, userId],
            };
          }
          return msg;
        });
        set({ messages: updatedMessages });
      },

      setCurrentConversation: (conversation: any) =>
        set({ currentConversation: conversation }),
      setCurrentUserId: (userId: string) => set({ currentUserId: userId }),
      setMessages: (messages: any[]) => set({ messages }),
      setConversations: (conversations: any[]) => set({ conversations }),

      getOrCreateConversation: async (userId: string, otherUserId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getOrCreateConversation(userId, otherUserId);
          const { generalStat } = response.data;

          if (generalStat) {
            set({ currentConversation: generalStat });
          }

          return generalStat;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      createConversation: async (userId: string, otherUserId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await createConversation(userId, otherUserId);
          const { posts } = response.data;

          return posts;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      getUserConversations: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getUserConversations(userId);
          const { users } = response.data;

          if (users) {
            set({ conversations: users });
          }

          return users;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      getMessages: async (conversationId: string, userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getMessages(conversationId, userId);
          const { users } = response.data;

          if (users) {
            set({ messages: users });
          }

          return users;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      getConversation: async (conversationId: string, userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getConversation(conversationId, userId);
          const { users } = response.data;

          if (users) {
            set({ currentConversation: users });
          }

          return users;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      getUsersWithConversation: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getUsersWithConversation(userId);
          const { users } = response.data;

          return users;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      chatAI: async (prompt: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await chatAI(prompt);
          const { users } = response.data;

          return users;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      createGroupConversation: async (formData: FormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await createGroupConversation(formData);
          const { users } = response.data;

          // Cập nhật danh sách cuộc hội thoại sau khi tạo mới
          const conversations = get().conversations;
          if (users && conversations) {
            set({ conversations: [...conversations, users] });
          }

          return users;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      addUserToGroup: async (conversationId: string, userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await addUserToGroup(conversationId, userId);
          const { users } = response.data;

          // Cập nhật cuộc hội thoại hiện tại sau khi thêm người dùng
          const currentConversation = get().currentConversation;
          if (
            users &&
            currentConversation &&
            currentConversation.id === conversationId
          ) {
            set({ currentConversation: users });
          }

          return users;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteUserFromGroup: async (conversationId: string, userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await deleteUserFromGroup(conversationId, userId);
          const { users } = response.data;

          // Cập nhật cuộc hội thoại hiện tại sau khi xóa người dùng
          const currentConversation = get().currentConversation;
          if (
            users &&
            currentConversation &&
            currentConversation.id === conversationId
          ) {
            set({ currentConversation: users });
          }

          return users;
        } catch (error: any) {
          console.error(error);
          const { message } = error.response.data;
          set({ error: message });

          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => {
        set({ ...initialState });
      },
    }),

    {
      name: "message-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
