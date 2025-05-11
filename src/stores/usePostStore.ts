import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  commentPost,
  createPost,
  createStory,
  deletePost,
  deleteStory,
  getAllPost,
  getAllStory,
  getUserPosts,
  likePost,
  sharePost,
  searchPosts,
  report,
  searchReports,
  deleteReport,
  resolveReport,
  updatePost,
  getAllReport,
  getUserStoryFeed,
  getUserFeed,
  deleteComment,
} from "@/utils/api/postApi";

export interface PostStore {
  status: number;
  message: string | null;
  isLoading: boolean;
  error: string | null;
  homePosts: any[];
  homeStories: any[];

  getAllPost: () => Promise<any>;
  getAllStory: () => Promise<any>;
  getAllReport: () => Promise<any>;
  getUserPosts: (userId: string) => Promise<any>;
  getUserFeed: (userId: string) => Promise<any>;
  getUserStoryFeed: (userId: string) => Promise<any>;
  createPost: (userId: string, formData: FormData) => Promise<any>;
  createStory: (userId: string, formData: FormData) => Promise<any>;
  deletePost: (postId: string) => Promise<any>;
  deleteStory: (storyId: string) => Promise<any>;
  deleteComment: (commentId: string, postId: string) => Promise<any>;
  likePost: (postId: string, userId: string) => Promise<any>;
  commentPost: (
    postId: string,
    userId: string,
    formData: FormData
  ) => Promise<any>;
  sharePost: (postId: string, userId: string) => Promise<any>;
  searchPosts: (query: string) => Promise<any>;
  report: (userId: string, contentId: string, formData: FormData) => Promise<any>;
  resolveReport: (reportId: string, formData: FormData) => Promise<any>;
  deleteReport: (reportId: string) => Promise<any>;
  searchReports: (query: string) => Promise<any>;
  updatePost: (postId: string, formData: FormData) => Promise<any>;
  addPostToHome: (post: any) => void;
  removePostFromHome: (postId: string) => void;
  updatePostInHome: (updatedPost: any) => void;
  addStoryToHome: (story: any) => void;
  removeStoryToHome: (storyId: string) => void;
  updateStoryInHome: (updatedStory: any) => void;
  reset: () => any;
}

const initialState = {
  status: 0,
  message: null,
  isLoading: false,
  error: null,
  homePosts: [],
  homeStories: [],
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      getAllPost: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await getAllPost();
          const { posts } = response.data;

          set({ homePosts: posts });
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

          set({ homeStories: stories });
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

      getAllReport: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await getAllReport();
          const { reports } = response.data;

          return reports;
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

      getUserFeed: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getUserFeed(userId);
          const { posts } = response.data;

          set({ homePosts: posts });
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

      getUserStoryFeed: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getUserStoryFeed(userId);
          const { stories } = response.data;

          set({ homeStories: stories });
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

      createPost: async (userId: string, formData: FormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await createPost(userId, formData);
          const { post, message } = response.data;

          const { addPostToHome } = get();
          addPostToHome(post);

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

          const { addStoryToHome } = get();
          addStoryToHome(story);

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

          const { removePostFromHome } = get();
          removePostFromHome(postId);

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

          const { removeStoryToHome } = get();
          removeStoryToHome(storyId);

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

      deleteComment: async (commentId: string, postId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await deleteComment(commentId, postId);
          const { post, message } = response.data;

          if (post) {
            const { updatePostInHome } = get();
            updatePostInHome(post);
          }

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
          const { updatedPost } = response.data;

          if (updatedPost) {
            const { updatePostInHome } = get();
            updatePostInHome(updatedPost);
          }

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

      commentPost: async (
        postId: string,
        userId: string,
        formData: FormData
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await commentPost(postId, userId, formData);
          const { post } = response.data;

          if (post) {
            const { updatePostInHome } = get();
            updatePostInHome(post);
          }

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
          const { message, sharedPost } = response.data;

          if (sharedPost) {
            const { addPostToHome } = get();
            addPostToHome(sharedPost);
          }

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

      searchPosts: async (query: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await searchPosts(query);
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

      report: async (userId: string, contentId: string, formData: FormData) => {
        set({ error: null });

        try {
          const response = await report(userId, contentId, formData);
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

      resolveReport: async (reportId: string, formData: FormData) => {
        set({ error: null });

        try {
          const response = await resolveReport(reportId, formData);
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

      deleteReport: async (reportId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await deleteReport(reportId);
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

      searchReports: async (query: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await searchReports(query);
          const { reports } = response.data;

          return reports;
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

      updatePost: async (postId: string, formData: FormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await updatePost(postId, formData);
          const { message, updatedPost } = response.data;

          if (updatedPost) {
            const { updatePostInHome } = get();
            updatePostInHome(updatedPost);
          }

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

      addPostToHome: (post) => {
        set((state) => ({
          homePosts: [post, ...state.homePosts]
        }));
      },

      removePostFromHome: (postId) => {
        set((state) => ({
          homePosts: state.homePosts.filter((post) => post.id !== postId)
        }));
      },

      updatePostInHome: (updatedPost) => {
        set((state) => ({
          homePosts: state.homePosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        }));
      },

      addStoryToHome: (story) => {
        set((state) => ({
          homeStories: [story, ...state.homeStories]
        }));
      },
      
      removeStoryToHome: (storyId) => {
        set((state) => ({
          homeStories: state.homeStories.filter((story) => story.id !== storyId)
        }));
      },

      updateStoryInHome: (updatedStory) => {
        set((state) => ({
          homeStories: state.homeStories.map((story) =>
            story.id === updatedStory.id ? updatedStory : story
          )
        }));
      },

      reset: () => { set({ ...initialState }); },
    }),

    {
      name: "post-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
