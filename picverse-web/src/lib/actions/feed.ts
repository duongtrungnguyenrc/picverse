"use server";

import { httpClient } from "../utils";

export const loadFirstPageFeed = async (): Promise<InfiniteResponse<Pin>> => {
  const query = new URLSearchParams({
    page: String(1),
    limit: String(30),
  });

  const firstPageFeed = await httpClient.get<InfiniteResponse<Pin>>(`/feed?${query}`);

  return firstPageFeed.data;
};
