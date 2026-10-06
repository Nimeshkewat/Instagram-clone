import { deleteComment } from "@/api/comments/comments";
import type { DeleteCommentResponse } from "@/api/comments/comments";
import type { ApiError } from "@/types/error";
import { useMutation } from "@tanstack/react-query";

export const useDeleteComment = () => {
  return useMutation<DeleteCommentResponse, ApiError, string>({
    mutationFn: deleteComment,
  });
};
