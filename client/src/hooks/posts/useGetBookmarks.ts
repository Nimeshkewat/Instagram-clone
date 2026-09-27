import { getBookmarkPosts } from "@/api/posts/posts";
import type { ApiError } from "@/types/error";
import type { GetBookmarkPostsResponse } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

export const useGetBookmarkPosts = () => {
  return useQuery<GetBookmarkPostsResponse, ApiError>({
    queryKey: ["bookmark-posts"],
    queryFn: getBookmarkPosts,
  });
};
