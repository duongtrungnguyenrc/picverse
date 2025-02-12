"use client";

import { useMutation } from "@tanstack/react-query";

import { httpClient, showAxiosToastError } from "../utils";

export const useCreatePin = () => {
  return useMutation<StatusResponse, AxiosError, CreatePinRequest>({
    mutationFn: async (payload) => {
      const data: FormData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "boolean") {
            data.append(key, value.toString());
          } else if (Array.isArray(value)) {
            value.forEach((tag) => data.append(key, tag));
          } else {
            data.append(key, value);
          }
        }
      });

      const response = await httpClient.post<StatusResponse>("/pin", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onError: showAxiosToastError,
  });
};
