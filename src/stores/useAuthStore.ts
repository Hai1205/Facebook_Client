import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { USER } from "@/utils/interface";
import { usePostStore } from './usePostStore';
import { useUserStore } from "./useUserStore";
import { useStatStore } from "./useStatStore";
import { useOpenStore } from "./useOpenStore";
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
import { useNotiStore } from "./useNotiStore";
import { useCallStore } from "./useCallStore";
import { getOnlineUsers } from "@/utils/api/chatApi";
import { useOnlineUsersStore } from "./useOnlineUsersStore";

export interface AuthStore {
	userAuth: USER | null;
	isAuth: boolean;
	isAdmin: boolean;
	status: number;
	message: string | null;
	isLoading: boolean;
	error: string | null;

	checkAdmin: () => Promise<any>;
	sendOTP: (email: string) => Promise<any>;
	checkOTP: (email: string, formData: FormData) => Promise<any>;
	register: (formData: FormData) => Promise<any>;
	login: (formData: FormData) => Promise<any>;
	loginGoogle: (formData: FormData) => Promise<any>;
	logout: () => Promise<any>;
	forgotPassword: (formData: FormData) => Promise<any>;
	changePassword: (userId: string, formData: FormData) => Promise<any>;
	resetPassword: (userId: string) => Promise<any>;
	setUserAuth: (user: USER | null) => any;
	reset: () => any;
}

const initialState = {
	userAuth: null,
	isAuth: false,
	isAdmin: false,
	isLoading: false,
	error: null,
	status: 0,
	message: null,
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			...initialState,

			checkAdmin: async () => {
				set({ isLoading: true, error: null });

				try {
					const response = await checkAdmin();
					const data: boolean = response.data;

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
					const { user } = response.data;

					const isActive = user.status === "ACTIVE"
					if (isActive) {
						set({ userAuth: user, isAuth: true })

						await get().checkAdmin();

						// Lấy danh sách người dùng đang online sau khi đăng nhập thành công
						try {
							const onlineResponse = await getOnlineUsers();
							if (onlineResponse.data && onlineResponse.data.data && onlineResponse.data.data.onlineUsers) {
								const onlineUsers = onlineResponse.data.data.onlineUsers;
								useOnlineUsersStore.getState().setOnlineUsers(onlineUsers);
								console.log("📋 Đã cập nhật danh sách người dùng online:", onlineUsers);
							}
						} catch (error) {
							console.error("Lỗi khi lấy danh sách người dùng online:", error);
						}
					}

					return { user: user, isActive: isActive };
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ userAuth: null, error: message });

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

					set({ userAuth: user, isAuth: true })
					await get().checkAdmin();

					// Lấy danh sách người dùng đang online sau khi đăng nhập thành công
					try {
						const onlineResponse = await getOnlineUsers();
						if (onlineResponse.data && onlineResponse.data.data && onlineResponse.data.data.onlineUsers) {
							const onlineUsers = onlineResponse.data.data.onlineUsers;
							useOnlineUsersStore.getState().setOnlineUsers(onlineUsers);
							console.log("📋 Đã cập nhật danh sách người dùng online:", onlineUsers);
						}
					} catch (error) {
						console.error("Lỗi khi lấy danh sách người dùng online:", error);
					}

					return user;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ userAuth: null, error: message });

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
				set({ userAuth: user });
			},

			reset: () => {
				set({ ...initialState });

				useCallStore.getState().reset();
				useNotiStore.getState().reset();
				useOpenStore.getState().reset();
				usePostStore.getState().reset();
				useStatStore.getState().reset();
				useUserStore.getState().reset();
				useOnlineUsersStore.getState().reset();
			},
		}),

		{
			name: "auth-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);


