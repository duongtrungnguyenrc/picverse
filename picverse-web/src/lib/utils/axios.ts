import axios, { AxiosInstance, AxiosResponse } from "axios";
import { redirect, RedirectType } from "next/navigation";

import { clearAuthCookie, getCookie, setAuthCookie } from "../actions";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api`,
});

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken: string | undefined = await getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX);

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

axiosInstance.interceptors.response.use(
  async (response) => response,
  /* eslint-disable no-explicit-any */
  async (error: any) => {
    const originalRequest = error.config;

    if (
      !originalRequest?.url.includes("refresh-token") &&
      !originalRequest?.url.includes("login") &&
      error.response?.status === 401
    ) {
      const token: string | undefined = await getCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX);

      if (token) {
        try {
          const response: AxiosResponse<TokenPair> = await axiosInstance({
            method: "POST",
            url: "/accounts/refresh-token",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status != 200) {
            await clearAuthCookie();
            redirect("/sign-in", RedirectType.replace);
          }

          await setAuthCookie(response.data);
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
