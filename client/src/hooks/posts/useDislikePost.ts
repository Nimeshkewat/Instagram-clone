import { dislikePost } from "@/api/posts/posts";
import type { ApiError } from "@/types/error";
import type { LikePostResponse } from "@/types/post";
import { useMutation } from "@tanstack/react-query";

export const useDislikePost = () => {
  return useMutation<LikePostResponse, ApiError, string>({
    mutationFn: dislikePost,
  });
};
