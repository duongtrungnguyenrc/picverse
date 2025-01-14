import axios, { AxiosInstance } from "axios";

import { clearAuthCookie, getCookie, setAuthCookie } from "../actions";

const baseURL: string = `${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api`;
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken: string | undefined = await getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX);

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

axiosInstance.interceptors.response.use(
  async (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (!originalRequest?.url.includes("sign-in") && error.response?.status === 401) {
      const token: string | undefined = await getCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX);

      if (token) {
        try {
          const response: Response = await fetch(`${baseURL}/auth/refresh-token`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status != 200) {
            await clearAuthCookie();
          }

          const tokenPair = await response.json();

          await setAuthCookie(tokenPair);
          return await axiosInstance(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);

export const httpClient = axiosInstance;
