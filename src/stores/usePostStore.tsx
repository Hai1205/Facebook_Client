import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  addCommentToPost,
  createPost,
  createStory,
  deletePost,
  deleteStory,
  getAllPost,
  getAllStory,
  getUserPosts,
  likePost,
  sharePost,
} from "@/utils/api/postApi";

export interface PostStore {
  status: number;
  message: string | null;
  isLoading: boolean;
  error: string | null;

  getAllPost: () => Promise<any>;
  getAllStory: () => Promise<any>;
  getUserPosts: (userId: string) => Promise<any>;
  createPost: (userId: string, formData: FormData) => Promise<any>;
  createStory: (userId: string, formData: FormData) => Promise<any>;
  deletePost: (postId: string) => Promise<any>;
  deleteStory: (storyId: string) => Promise<any>;
  likePost: (postId: string, userId: string) => Promise<any>;
  addCommentToPost: (
    postId: string,
    userId: string,
    text: string
  ) => Promise<any>;
  sharePost: (postId: string, userId: string) => Promise<any>;
  reset: () => any;
}

export const usePostStore = create<PostStore>()(
  persist(
    (set) => ({
      status: 0,
      message: null,
      isLoading: false,
      error: null,

      getAllPost: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await getAllPost();
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
      
      getAllStory: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await getAllStory();
          const { stories } = response.data;

          return stories;
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
      
      getUserPosts: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getUserPosts(userId);
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
      
      createPost: async (userId: string, formData: FormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await createPost(userId, formData);
          const { post, message } = response.data;

          toast.success(message);
          return post;
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

      createStory: async (userId: string, formData: FormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await createStory(userId, formData);
          const { story, message } = response.data;

          toast.success(message);
          return story;
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

      deletePost: async (postId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await deletePost(postId);
          const { message } = response.data;

          toast.success(message);
          return message;
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

      deleteStory: async (storyId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await deleteStory(storyId);
          const { message } = response.data;

          toast.success(message);
          return true;
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

      likePost: async (postId: string, userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await likePost(postId, userId);
          const { message } = response.data;

          toast.success(message);
          return true;
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

      addCommentToPost: async (
        postId: string,
        userId: string,
        text: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await addCommentToPost(postId, userId, text);
          const { message } = response.data;

          toast.success(message);
          return true;
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

      sharePost: async (postId: string, userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await sharePost(postId, userId);
          const { message } = response.data;

          toast.success(message);
          return true;
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
        set({
          status: 0,
          message: null,
          isLoading: false,
          error: null,
        });
      },
    }),

    {
      name: "post-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
