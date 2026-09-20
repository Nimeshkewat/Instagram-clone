import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookmarkPost,
  createPost,
  deletePost,
  dislikePost,
  getPosts,
  likePost,
} from "@/api/posts/posts";
import type { ApiError } from "@/types/error";
import type {
  BookmarkPostResponse,
  CreatePostResponse,
  DeletePostResponse,
  GetPostsResponse,
  LikePostResponse,
} from "@/types/post";

export const usePosts = () => {
  return useQuery<GetPostsResponse, ApiError>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePostResponse, ApiError, FormData>({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<DeletePostResponse, ApiError, string>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation<LikePostResponse, ApiError, string>({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDislikePost = () => {
  const queryClient = useQueryClient();

  return useMutation<LikePostResponse, ApiError, string>({
    mutationFn: dislikePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useBookmarkPost = () => {
  const queryClient = useQueryClient();

  return useMutation<BookmarkPostResponse, ApiError, string>({
    mutationFn: bookmarkPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
