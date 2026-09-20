import { api } from "@/lib/axios";

interface CommentPayload {
  text: string;
}

interface CommentUser {
  _id: string;
  username: string;
  profilePicture?: string;
}

export interface CommentItem {
  _id: string;
  text: string;
  author: CommentUser;
  post: string;
  createdAt?: string;
}

export interface GetCommentsResponse {
  success: boolean;
  comments: CommentItem[];
}

export interface AddCommentResponse {
  success: boolean;
  message: string;
  comment: CommentItem;
}

export const addComment = async (
  postId: string,
  payload: CommentPayload,
): Promise<AddCommentResponse> => {
  const response = await api.post<AddCommentResponse>(
    `/comments/${postId}`,
    payload,
  );
  return response.data;
};

export const getPostComments = async (
  postId: string,
): Promise<GetCommentsResponse> => {
  const response = await api.get<GetCommentsResponse>(`/comments/${postId}`);
  return response.data;
};
