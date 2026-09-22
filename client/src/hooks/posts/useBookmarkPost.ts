import { bookmarkPost } from "@/api/posts/posts";
import type { ApiError } from "@/types/error";
import type { BookmarkPostResponse } from "@/types/post";
import { useMutation } from "@tanstack/react-query";

export const useBookmarkPost = () => {
  return useMutation<BookmarkPostResponse, ApiError, string>({
    mutationFn: bookmarkPost,
  });
};
