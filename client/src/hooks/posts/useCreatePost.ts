import { createPost } from "@/api/posts/posts";
import type { ApiError } from "@/types/error";
import type { CreatePostResponse } from "@/types/post";
import { useMutation } from "@tanstack/react-query";

export const useCreatePost = () => {
  return useMutation<CreatePostResponse, ApiError, FormData>({
    mutationFn: createPost,
  });
};
