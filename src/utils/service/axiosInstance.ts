import { serverUrl } from "@/lib/utils";
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return matches ? matches[2] : null;
};

const axiosInstance = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
  headers: {
    accept: "application/json",
  },
});

const getAccessToken = (item: string): string | null => {
  return getCookie(item) || localStorage.getItem(item) || sessionStorage.getItem(item);
};

// const MAX_RETRIES = 3;

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    (config as any).retryCount = (config as any).retryCount || 0;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
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
