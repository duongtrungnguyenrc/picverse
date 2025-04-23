import { getAuthCookie, refreshToken } from "../actions";
import { BASE_URL } from "../constants";

type BaseRequestConfigs = Omit<RequestInit, "body"> & {
  query?: Record<string, string | number | undefined>;
  rawResponse?: boolean;
};

type RequestConfigs = BaseRequestConfigs & { retry?: boolean };

function getQueryString(queryObject: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(queryObject).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  return `?${searchParams}`;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: string,
    body?: BodyInit,
    config: BaseRequestConfigs = {},
    retry: boolean = true,
  ): Promise<T | Response> {
    const { query, rawResponse, ...restConfig } = config;
    const url = `${this.baseUrl}${endpoint}${query ? getQueryString(query) : ""}`;

    const accessToken = await getAuthCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX);

    const response = await fetch(url, {
      ...restConfig,
      method,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        ...(typeof body === "string" ? { "Content-Type": "application/json" } : {}),
        ...restConfig.headers,
      },
      body,
    });

    if (response.status === 401 && retry) {
      try {
        await refreshToken();
        return this.request(endpoint, method, body, config, false);
      } catch (error) {
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (rawResponse) return response;

    const contentType = response.headers.get("content-type");
    let responseData: any;

    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new Error(responseData?.message || `${response.statusText}`);
    }

    return responseData as T;
  }

  async get<T>(endpoint: string, config?: RequestConfigs & { rawResponse?: false }): Promise<T>;
  async get(endpoint: string, config?: RequestConfigs & { rawResponse: true }): Promise<Response>;
  async get<T>(endpoint: string, config?: RequestConfigs): Promise<T | Response> {
    return this.request<T>(endpoint, "GET", undefined, config, config?.retry);
  }

  async post<T>(endpoint: string, body?: BodyInit, config?: RequestConfigs & { rawResponse?: false }): Promise<T>;
  async post(endpoint: string, body?: BodyInit, config?: RequestConfigs & { rawResponse: true }): Promise<Response>;
  async post<T>(endpoint: string, body?: BodyInit, config?: RequestConfigs): Promise<T | Response> {
    return this.request<T>(endpoint, "POST", body, config, config?.retry);
  }

  async put<T>(endpoint: string, body?: BodyInit, config?: RequestConfigs & { rawResponse?: false }): Promise<T>;
  async put(endpoint: string, body?: BodyInit, config?: RequestConfigs & { rawResponse: true }): Promise<Response>;
  async put<T>(endpoint: string, body?: BodyInit, config?: RequestConfigs): Promise<T | Response> {
    return this.request<T>(endpoint, "PUT", body, config, config?.retry);
  }

  async delete<T>(endpoint: string, config?: RequestConfigs & { rawResponse?: false }): Promise<T>;
  async delete(endpoint: string, config?: RequestConfigs & { rawResponse: true }): Promise<Response>;
  async delete<T>(endpoint: string, config?: RequestConfigs): Promise<T | Response> {
    return this.request<T>(endpoint, "DELETE", undefined, config, config?.retry);
  }
}

export const httpFetchClient = new HttpClient(BASE_URL);
