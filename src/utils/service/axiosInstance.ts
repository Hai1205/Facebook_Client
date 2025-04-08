import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Hàm lấy JWT token từ cookies
const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return matches ? matches[2] : null;
};

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL as string,
  withCredentials: true,
  headers: {
    accept: "application/json",
  },
});

// Hàm lấy JWT từ cookies, localStorage hoặc sessionStorage
const getAccessToken = (item: string): string | null => {
  return getCookie(item) || localStorage.getItem(item) || sessionStorage.getItem(item);
};

// Số lần thử lại tối đa
// const MAX_RETRIES = 3;

// Thêm request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Thêm biến retryCount vào config để theo dõi số lần thử lại
    (config as any).retryCount = (config as any).retryCount || 0;

    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // Kiểm tra số lần thử lại
    // const config = error.config;
    // if ((config as any).retryCount < MAX_RETRIES) {
    //   (config as any).retryCount += 1;
    //   return axiosInstance(config);
    // }

    return error?.response?.data?.message
      ? Promise.reject(error)
      : Promise.reject(error);
  }
);

export default axiosInstance;
