import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/posts/posts";
import type { ApiError } from "@/types/error";
import type { GetPostsResponse } from "@/types/post";

export const usePosts = () => {
  return useQuery<GetPostsResponse, ApiError>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
};
