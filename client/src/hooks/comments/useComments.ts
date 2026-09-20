import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addComment,
  getPostComments,
  type AddCommentResponse,
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

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AddCommentResponse,
    ApiError,
    { postId: string; text: string }
  >({
    mutationFn: ({ postId, text }) => addComment(postId, { text }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
