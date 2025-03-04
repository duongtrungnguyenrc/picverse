"use server";

import { revalidateTag } from "next/cache";

import { httpFetchClient } from "../utils";
import { BoardTags } from "../constants";

export const loadUserBoards = async (signature?: string) => {
  return await httpFetchClient.get<Array<UserBoard>>(`/board/user`, {
    query: {
      signature: signature,
    },
    next: {
      revalidate: 5,
      tags: [BoardTags.USER_BOARDS],
    },
  });
};

export const revalidateUserBoards = async () => revalidateTag(BoardTags.USER_BOARDS);
export const revalidateUserBoard = async () => revalidateTag(BoardTags.USER_BOARD);

export const createBoard = async (payload: CreateBoardRequest) => {
  const response = await httpFetchClient.post<StatusResponse>("/board", JSON.stringify(payload));

  revalidateUserBoards();
  return response;
};

export const loadBoard = async (id: string) => {
  return await httpFetchClient.get<Board>(`/board/${id}`, {
    next: {
      tags: [BoardTags.USER_BOARD],
    },
  });
};
