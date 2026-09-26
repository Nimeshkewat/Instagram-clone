import { useQuery } from "@tanstack/react-query";
import { getFeedPosts, getPosts } from "@/api/posts/posts";
import type { ApiError } from "@/types/error";
import type { GetPostsResponse } from "@/types/post";

export const usePosts = (scope: "profile" | "feed" = "profile") => {
  return useQuery<GetPostsResponse, ApiError>({
    queryKey: scope === "feed" ? ["feed-posts"] : ["posts"],
    queryFn: scope === "feed" ? getFeedPosts : getPosts,
  });
};
