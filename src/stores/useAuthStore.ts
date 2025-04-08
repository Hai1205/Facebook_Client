import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
	checkArtist,
	login,
	logout,
	refreshToken,
	register,
	changePassword,
	resetPassword,
	sendOTP,
	checkOTP,
	forgotPassword,
	loginWithGoogle
} from './../utils/api/authApi';
import { checkAdmin } from "@/utils/api/authApi";
import { useUserStore } from "./useUserStore";
import { useMusicStore } from "./useMusicStore";
import { usePlayerStore } from "./usePlayerStore";
import { useStatStore } from "./useStatStore";
import { User } from "@/utils/types";

export interface AuthStore {
	status: number;
	message: string | null;
	isLoading: boolean;
	error: string | null;
	user: User | null;
	isAuth: boolean;
	isArtist: boolean;
	isAdmin: boolean;

	checkAdmin: () => Promise<any>;
	checkArtist: () => Promise<any>;
	sendOTP: (email: string) => Promise<any>;
	checkOTP: (email: string, OTP: string) => Promise<any>;
	register: (formData: FormData) => Promise<any>;
	login: (formData: FormData) => Promise<any>;
	loginWithGoogle: (formData: FormData) => Promise<any>;
	logout: () => Promise<any>;
	forgotPassword: (formData: FormData) => Promise<any>;
	changePassword: (userId: string, formData: FormData) => Promise<any>;
	resetPassword: (userId: string) => Promise<any>;
	refreshToken: () => Promise<any>;
	setUserAuth: (user: User | null) => any;
	reset: () => any;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			isAuth: false,
			isArtist: false,
			isAdmin: false,
			isLoading: false,
			error: null,
			status: 0,
			message: null,

			checkAdmin: async () => {
				set({ isLoading: true, error: null });

				try {
					const response = await checkAdmin();
					const data: boolean = response.data.isAdmin;

					set({ isAdmin: data });
					return true;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ isAdmin: false, error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			checkArtist: async () => {
				set({ isLoading: true, error: null });

				try {
					const response = await checkArtist();
					const data: boolean = response.data.isArtist;

					set({ isArtist: data });
					return true;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ isArtist: false, error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			sendOTP: async (email) => {
				set({ isLoading: true, error: null });

				try {
					await sendOTP(email);

					return true;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ isArtist: false, error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			checkOTP: async (email, OTP) => {
				set({ isLoading: true, error: null });

				try {
					const response = await checkOTP(email, OTP);
					const { message } = response.data;

					toast.success(message);
					return true;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ isArtist: false, error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			register: async (formData) => {
				set({ isLoading: true, error: null });

				try {
					const response = await register(formData);
					const { message } = response.data;

					toast.success(message);
					return message;
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

			login: async (formData) => {
				set({ isLoading: true, error: null });

				try {
					const response = await login(formData);
					const { user, isVerified } = response.data;

					if (isVerified) {
						set({ user, isAuth: true })

						await get().checkAdmin();
						await get().checkArtist();
					}

					return { user: user, isVerified };
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ user: null, error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			loginWithGoogle: async (formData) => {
				set({ isLoading: true, error: null });

				try {
					const response = await loginWithGoogle(formData);
					const { user } = response.data;

					set({ user, isAuth: true })
					await get().checkAdmin();
					await get().checkArtist();

					return user;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ user: null, error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			logout: async () => {
				set({ isLoading: true, error: null });

				try {
					await logout();

					get().reset();
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

			changePassword: async (userId, formData) => {
				set({ isLoading: true, error: null });

				try {
					const response = await changePassword(userId, formData);
					const { message } = response.data;

					toast.success(message);
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

			forgotPassword: async (formData) => {
				set({ isLoading: true, error: null });

				try {
					const response = await forgotPassword(formData);
					const { message } = response.data;

					toast.success(message);
					return true;
				} catch (error: any) {
					set({ error: error });
					console.error(error)
					const { message } = error.response.data;

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			resetPassword: async (userId) => {
				set({ isLoading: true, error: null });

				try {
					const response = await resetPassword(userId);
					const { message } = response.data;

					toast.success(message);
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

			refreshToken: async () => {
				set({ isLoading: true, error: null });

				try {
					await refreshToken();

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

			setUserAuth: (user) => {
				set({ user: user });
			},

			reset: () => {
				set({
					user: null,
					status: 0,
					message: null,
					isAdmin: false,
					isArtist: false,
					isAuth: false,
					isLoading: false,
					error: null
				});

				useUserStore.getState().reset();
				useMusicStore.getState().reset();
				usePlayerStore.getState().reset();
				useStatStore.getState().reset();
				useUserStore.getState().reset();
			},
		}),

		{
			name: "auth-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);


