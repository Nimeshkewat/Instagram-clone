import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMessages,
  sendMessage,
  type MessageResponse,
  type SendMessageResponse,
} from "@/api/messages/messages";
import type { ApiError } from "@/types/error";

export const useMessages = (userId: string) => {
  return useQuery<MessageResponse, ApiError>({
    queryKey: ["messages", userId],
    queryFn: () => getMessages(userId),
    enabled: !!userId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SendMessageResponse,
    ApiError,
    { userId: string; message: string }
  >({
    mutationFn: ({ userId, message }) => sendMessage(userId, { message }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.userId],
      });
    },
  });
};
