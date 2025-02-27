import { clearAuthCookie, getAuthCookie, refreshToken, setAuthCookie } from "../actions";
import { BASE_URL } from "../constants";

type BaseRequestConfigs = Omit<RequestInit, "body"> & {
  query?: Record<string, string | number | undefined>;
};

type RequestConfigs = BaseRequestConfigs & { retry?: boolean };

function getQueryString(queryObject: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(queryObject).forEach(([key, value]) => value && searchParams.set(key, String(value)));

  return `?${searchParams}`;
}

const baseRequest = async <T>(
  endpoints: string,
  body?: BodyInit,
  config: BaseRequestConfigs = {},
  retry: boolean = true,
): Promise<T> => {
  const { query, ...restConfig } = config;
  const url = `${BASE_URL}${endpoints}${query ? getQueryString(query) : ""}`;

  const accessToken = await getAuthCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX);

  const response = await fetch(url, {
    ...restConfig,
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      ...restConfig.headers,
    },
    body,
  });

  if (response.status === 401 && retry) {
    try {
      await refreshToken();

      return baseRequest(endpoints, body, config, false);
    } catch (error) {
      throw new Error("Session expired. Please log in again.");
    }
  }

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
};

export const httpFetchClient = {
  get: <T>(url: string, config?: RequestConfigs) =>
    baseRequest<T>(url, undefined, { ...config, method: "GET" }, config?.retry),
  post: <T>(url: string, body?: BodyInit, config?: RequestConfigs) =>
    baseRequest<T>(url, body, { ...config, method: "POST" }, config?.retry),
  put: <T>(url: string, body?: BodyInit, config?: RequestConfigs) =>
    baseRequest<T>(url, body, { ...config, method: "PUT" }, config?.retry),
  delete: <T>(url: string, config?: RequestConfigs) =>
    baseRequest<T>(url, undefined, { ...config, method: "DELETE" }, config?.retry),
};
