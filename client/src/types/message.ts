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

export interface DeleteMessageResponse {
  success: boolean;
  message: string;
}

export interface DeletedMessageEvent {
  messageId: string;
  senderId: string;
  receiverId: string;
}

export interface MessagePayload {
  message: string;
}
