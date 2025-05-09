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
import { USER } from "@/utils/interface";

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

  activeChats: USER[];
  startChat: (user: USER) => void;
  closeChat: (userId: string) => void;
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
        const updatedConversations = conversations.map((conversation) => {
          if (conversation.id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: message,
              updatedAt: new Date().toISOString(),
            };
          }
          return conversation;
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
          console.log(response)
          const { conversation } = response.data;

          if (conversation) {
            set({ currentConversation: conversation });
          }

          return conversation;
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
          const { messageResponses } = response.data;

          if (messageResponses) {
            set({ messages: messageResponses });
          }

          return messageResponses;
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

      activeChats: [],

      startChat: (user: USER) => {
        set((state) => {
          if (state.activeChats.some(chat => chat.id === user.id)) {
            return state;
          }

          const newChats = [user, ...state.activeChats];
          return { activeChats: newChats.slice(0, 4) };
        });
      },

      closeChat: (userId: string) => {
        set((state) => ({
          activeChats: state.activeChats.filter((chat) => chat.id !== userId),
        }));
      },
    }),

    {
      name: "message-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
