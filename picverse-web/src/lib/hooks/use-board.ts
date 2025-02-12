"use client";

import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../utils";

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: async (payload: CreateBoardRequest) => {
      const response = await httpClient.post<StatusResponse>("/board", payload);

      return response.data;
    },
  });
};
