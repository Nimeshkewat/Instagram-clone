import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const requestUrl = config?.url ?? "";
    const shouldSkipRefresh =
      !config ||
      error.response?.status !== 401 ||
      config._retry ||
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/register") ||
      requestUrl.includes("/users/logout") ||
      requestUrl.includes("/users/refresh");

    if (shouldSkipRefresh) return Promise.reject(error);

    config._retry = true;
    refreshPromise ??= api
      .post("/users/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });

    try {
      await refreshPromise;
      return api.request(config);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
