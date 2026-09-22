import { useQuery } from "@tanstack/react-query";
import {
  getPostComments,
  type GetCommentsResponse,
} from "@/api/comments/comments";
import type { ApiError } from "@/types/error";

export const usePostComments = (postId: string) => {
  return useQuery<GetCommentsResponse, ApiError>({
    queryKey: ["comments", postId],
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  });
};
