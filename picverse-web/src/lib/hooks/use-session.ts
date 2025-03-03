"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { httpFetchClient } from "../utils";

export const useAcessRecords = (pagination: Pagination) => {
  return useQuery<PaginationResponse<AccessRecord>, AxiosError>({
    queryKey: [QueryKeys.ACCESS_RECORDS, String(pagination.page)],
    queryFn: async () => {
      return await httpFetchClient.get<PaginationResponse<AccessRecord>>("/session/access", {
        query: {
          ...pagination,
          limit: 20,
        },
      });
    },
  });
};
