import { api } from "@/lib/axios";
import type {
  CreatePostResponse,
  GetPostsResponse,
  DeletePostResponse,
  LikePostResponse,
  BookmarkPostResponse,
} from "@/types/post";

export const createPost = async (
  formData: FormData,
): Promise<CreatePostResponse> => {
  const response = await api.post<CreatePostResponse>("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getPosts = async (): Promise<GetPostsResponse> => {
  const response = await api.get<GetPostsResponse>("/posts");
  return response.data;
};

export const deletePost = async (
  postId: string,
): Promise<DeletePostResponse> => {
  const response = await api.delete<DeletePostResponse>(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId: string): Promise<LikePostResponse> => {
  const response = await api.patch<LikePostResponse>(`/posts/${postId}/like`);
  return response.data;
};

export const dislikePost = async (
  postId: string,
): Promise<LikePostResponse> => {
  const response = await api.patch<LikePostResponse>(
    `/posts/${postId}/dislike`,
  );
  return response.data;
};

export const bookmarkPost = async (
  postId: string,
): Promise<BookmarkPostResponse> => {
  const response = await api.patch<BookmarkPostResponse>(
    `/posts/${postId}/bookmark`,
  );
  return response.data;
};
