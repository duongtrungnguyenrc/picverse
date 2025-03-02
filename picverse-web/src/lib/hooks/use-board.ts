"use client";

import { useMutation } from "@tanstack/react-query";
import { createBoard } from "../actions";
import { showToastError } from "../utils";

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: createBoard,
    onError: showToastError,
  });
};
