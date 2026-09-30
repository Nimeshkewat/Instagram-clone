import { api } from "@/lib/axios";
import type {
  DeleteMessageResponse,
  MessagePayload,
  MessageResponse,
  SendMessageResponse,
} from "@/types/message";

export const sendMessage = async (
  userId: string,
  payload: MessagePayload,
): Promise<SendMessageResponse> => {
  const response = await api.post<SendMessageResponse>(
    `/messages/${userId}`,
    payload,
  );
  return response.data;
};

export const getMessages = async (userId: string): Promise<MessageResponse> => {
  const response = await api.get<MessageResponse>(`/messages/${userId}`);
  return response.data;
};

export const deleteMessage = async (
  messageId: string,
): Promise<DeleteMessageResponse> => {
  const response = await api.delete<DeleteMessageResponse>(
    `/messages/${messageId}`,
  );
  return response.data;
};
