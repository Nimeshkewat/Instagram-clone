import { sendMessage, type SendMessageResponse } from "@/api/messages/messages";
import type { ApiError } from "@/types/error";
import { useMutation } from "@tanstack/react-query";

export const useSendMessage = () => {
  return useMutation<
    SendMessageResponse,
    ApiError,
    { userId: string; message: string }
  >({
    mutationFn: ({ userId, message }) => sendMessage(userId, { message }),
  });
};
