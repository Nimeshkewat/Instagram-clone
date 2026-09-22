import { useQuery } from "@tanstack/react-query";
import { getMessages, type MessageResponse } from "@/api/messages/messages";
import type { ApiError } from "@/types/error";

export const useMessages = (userId: string) => {
  return useQuery<MessageResponse, ApiError>({
    queryKey: ["messages", userId],
    queryFn: () => getMessages(userId),
    enabled: !!userId,
  });
};
