import { api } from "@/lib/axios";

interface MessagePayload {
  message: string;
}

export interface MessageItem {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
}

export interface MessageResponse {
  success: boolean;
  messages: MessageItem[];
}

export interface SendMessageResponse {
  success: boolean;
  newMessage: MessageItem;
}

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
