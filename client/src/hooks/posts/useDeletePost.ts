import { deletePost } from "@/api/posts/posts";
import type { ApiError } from "@/types/error";
import type { DeletePostResponse } from "@/types/post";
import { useMutation } from "@tanstack/react-query";

export const useDeletePost = () => {
  return useMutation<DeletePostResponse, ApiError, string>({
    mutationFn: deletePost,
  });
};
