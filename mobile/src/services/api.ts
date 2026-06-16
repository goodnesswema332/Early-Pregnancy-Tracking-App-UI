import axios, { AxiosError, AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Update this with your backend URL
const API_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000/api"
    : "https://your-production-api.com/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Attach access token to requests
api.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh flow: queue requests while refreshing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (err?: any) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(prom.config);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest: any = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // attempt refresh
      if (isRefreshing) {
        // queue request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        })
          .then((conf: any) => api(conf))
          .catch((err: any) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const resp = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          resp.data.data || resp.data || {};

        if (newAccessToken) {
          await AsyncStorage.setItem("accessToken", newAccessToken);
        }
        if (newRefreshToken) {
          await AsyncStorage.setItem("refreshToken", newRefreshToken);
        }

        processQueue(null, newAccessToken || null);
        isRefreshing = false;

        const retryConfig = Object.assign({}, originalRequest, {
          headers: Object.assign({}, originalRequest.headers, {
            Authorization: `Bearer ${newAccessToken}`,
          }),
        });
        console.log(
          "api interceptor: refreshed tokens",
          newAccessToken,
          newRefreshToken,
        );
        console.log("api interceptor: retry headers", retryConfig.headers);
        return api.request(retryConfig as any);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        // clear storage and propagate
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        await AsyncStorage.removeItem("userData");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
