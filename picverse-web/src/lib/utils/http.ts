import { getAuthCookie, setAuthCookie } from "../actions";

type BaseRequestConfigs = Omit<RequestInit, "body"> & {
  query?: Map<string, string> | Record<string, string>;
};

type RequestConfigs = BaseRequestConfigs & { retry?: boolean };

const baseUrl: string = `${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api`;

function convertMapToObject(map: Map<string, string> | Record<string, string>): Record<string, string> {
  if (map instanceof Map) {
    const newObject: Record<string, string> = {};
    for (const [key, value] of map) {
      newObject[key] = value;
    }
    return newObject;
  }
  return map;
}

const refreshToken = async (): Promise<string> => {
  const refreshToken: string | undefined = await getAuthCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX);

  if (!refreshToken) throw new Error("No refresh token available");

  const response = await fetch(`${baseUrl}/auth/refresh-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to refresh token");

  const data = await response.json();
  await setAuthCookie(data);

  return data;
};

const baseRequest = async <T>(
  endpoints: string,
  body?: BodyInit,
  config: BaseRequestConfigs = {},
  retry: boolean = true,
): Promise<T> => {
  const { query, ...restConfig } = config;
  const url = `${baseUrl}${endpoints}${query ? `?${new URLSearchParams(convertMapToObject(query))}` : ""}`;

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
