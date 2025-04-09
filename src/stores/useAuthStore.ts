import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/utils/types";
import { usePostStore } from './usePostStore';
import { useUserStore } from "./useUserStore";
import { useStatStore } from "./useStatStore";
import { useOpenStore } from "./useOpenStore";
import { useUserBioStore } from "./useUserBioStore";
import {
	changePassword,
	checkAdmin,
	checkOTP,
	forgotPassword,
	login,
	loginGoogle,
	logout,
	register,
	resetPassword,
	sendOTP
} from "@/utils/api/authApi";

export interface AuthStore {
	status: number;
	message: string | null;
	isLoading: boolean;
	error: string | null;
	user: User | null;
	isAuth: boolean;
	isAdmin: boolean;

	checkAdmin: () => Promise<any>;
	sendOTP: (email: string) => Promise<any>;
	checkOTP: (email: string, OTP: string) => Promise<any>;
	register: (formData: FormData) => Promise<any>;
	login: (formData: FormData) => Promise<any>;
	loginGoogle: (formData: FormData) => Promise<any>;
	logout: () => Promise<any>;
	forgotPassword: (formData: FormData) => Promise<any>;
	changePassword: (userId: string, formData: FormData) => Promise<any>;
	resetPassword: (userId: string) => Promise<any>;
	setUserAuth: (user: User | null) => any;
	reset: () => any;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			isAuth: false,
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

			sendOTP: async (email) => {
				set({ isLoading: true, error: null });

				try {
					await sendOTP(email);

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
					set({ error: message });

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

			loginGoogle: async (formData) => {
				set({ isLoading: true, error: null });

				try {
					const response = await loginGoogle(formData);
					const { user } = response.data;

					set({ user, isAuth: true })
					await get().checkAdmin();

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

			setUserAuth: (user) => {
				set({ user: user });
			},

			reset: () => {
				set({
					user: null,
					status: 0,
					message: null,
					isAdmin: false,
					isAuth: false,
					isLoading: false,
					error: null
				});

				useUserStore.getState().reset();
				useStatStore.getState().reset();
				usePostStore.getState().reset();
				useOpenStore.getState().reset();
				useUserBioStore.getState().reset();
			},
		}),

		{
			name: "auth-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);


