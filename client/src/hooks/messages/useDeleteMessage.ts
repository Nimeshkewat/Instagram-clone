import { deleteMessage } from "@/api/messages/messages";
import type { ApiError } from "@/types/error";
import type { DeleteMessageResponse } from "@/types/message";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMessage = () => {
  return useMutation<DeleteMessageResponse, ApiError, string>({
    mutationFn: deleteMessage,
  });
};
