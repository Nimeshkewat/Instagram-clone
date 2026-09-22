import { addComment, type AddCommentResponse } from "@/api/comments/comments";
import type { ApiError } from "@/types/error";
import { useMutation } from "@tanstack/react-query";

export const useAddComment = () => {
  return useMutation<
    AddCommentResponse,
    ApiError,
    { postId: string; text: string }
  >({
    mutationFn: ({ postId, text }) => addComment(postId, { text }),
  });
};
