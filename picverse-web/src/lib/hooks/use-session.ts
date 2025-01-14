"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { httpClient } from "../utils";

export const useAcessRecords = (pagination: Pagination) => {
  return useQuery<PaginationResponse<AccessRecord>, AxiosError>({
    queryKey: [QueryKeys.ACCESS_RECORDS, String(pagination.page)],
    queryFn: async () => {
      const response = await httpClient.get<PaginationResponse<AccessRecord>>("/session/access", {
        params: pagination,
      });
      return response.data;
    },
  });
};
