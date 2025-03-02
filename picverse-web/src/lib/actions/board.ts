"use server";

import { revalidateTag } from "next/cache";

import { httpFetchClient } from "../utils";
import { BoardTags } from "../constants";

export const loadUserBoards = async (id?: string) => {
  return await httpFetchClient.get<Array<UserBoard>>(`/board/user`, {
    query: {
      id: id,
    },
    next: {
      revalidate: 5,
      tags: [BoardTags.USER_BOARDS],
    },
  });
};

export const revalidateUserBoards = async () => revalidateTag(BoardTags.USER_BOARDS);

export const createBoard = async (payload: CreateBoardRequest) => {
  const response = await httpFetchClient.post<StatusResponse>("/board", JSON.stringify(payload));

  revalidateUserBoards();
  return response;
};
