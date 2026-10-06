import { useEffect, useState, type SubmitEvent } from "react";
import { Send } from "lucide-react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useMessages } from "@/hooks/messages/useMessages";
import { useSendMessage } from "@/hooks/messages/useSendMessage";
import { useDeleteMessage } from "@/hooks/messages/useDeleteMessage";
import { useProfile } from "@/hooks/users/useProfile";
import { useSuggestedUsers } from "@/hooks/users/useSuggestedUsers";
import type {
  DeletedMessageEvent,
  MessageItem,
  MessageResponse,
} from "@/types/message";
import type { UserProfile } from "@/types/users";
import { toast } from "sonner";
import MessageInbox from "@/components/messages/MessageInbox";
import MessageChatHeader from "@/components/messages/MessageChatHeader";
import MessageList from "@/components/messages/MessageList";
import MessageComposer from "@/components/messages/MessageComposer";

const socketUrl = new URL(
  import.meta.env.VITE_BASE_URL || window.location.origin,
  window.location.origin,
).origin;

function parseMessageDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function appendMessage(
  current: MessageResponse | undefined,
  message: MessageItem,
) {
  const messages = current?.messages ?? [];
  if (messages.some((item) => item._id === message._id)) return current;
  return { success: true, messages: [...messages, message] };
}

function Messages() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { data: profileData } = useProfile();
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useSuggestedUsers();
  const { data: messagesData, isLoading: areMessagesLoading } = useMessages(
    selectedUser?._id ?? "",
  );
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage();

  const currentUserId = profileData?.user._id;
  const followedUserIds = profileData?.user.followings ?? [];
  const contacts = (usersData?.suggestedUsers ?? []).filter(
    (user) =>
      followedUserIds.includes(user._id) &&
      user.username.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const messages = [...(messagesData?.messages ?? [])].sort(
    (first, second) =>
      (parseMessageDate(first.createdAt)?.getTime() ?? 0) -
      (parseMessageDate(second.createdAt)?.getTime() ?? 0),
  );

  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(socketUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    const onOnlineUsers = (userIds: string[]) => setOnlineUserIds(userIds);
    const clearOnlineUsers = () => setOnlineUserIds([]);
    const refreshAfterResume = () => {
      if (document.visibilityState !== "visible") return;

      void queryClient
        .invalidateQueries({ queryKey: ["messages"] })
        .finally(() => {
          if (!socket.connected) socket.connect();
        });
    };
    const refreshMessagesOnConnect = () => {
      void queryClient.invalidateQueries({ queryKey: ["messages"] });
    };
    const pauseWhileOffline = () => {
      clearOnlineUsers();
      socket.disconnect();
    };
    const onNewMessage = (message: MessageItem) => {
      const conversationUserId =
        message.senderId === currentUserId
          ? message.receiverId
          : message.senderId;

      queryClient.setQueryData<MessageResponse>(
        ["messages", conversationUserId],
        (current) => appendMessage(current, message),
      );
    };
    const onMessageDeleted = ({
      messageId,
      senderId,
      receiverId,
    }: DeletedMessageEvent) => {
      const conversationUserId =
        senderId === currentUserId ? receiverId : senderId;

      queryClient.setQueryData<MessageResponse>(
        ["messages", conversationUserId],
        (current) =>
          current
            ? {
                ...current,
                messages: current.messages.filter(
                  (message) => message._id !== messageId,
                ),
              }
            : current,
      );
    };

    socket.on("onlineUsers", onOnlineUsers);
    socket.on("connect", refreshMessagesOnConnect);
    socket.on("disconnect", clearOnlineUsers);
    socket.on("connect_error", clearOnlineUsers);
    socket.on("newMessage", onNewMessage);
    socket.on("messageDeleted", onMessageDeleted);
    document.addEventListener("visibilitychange", refreshAfterResume);
    window.addEventListener("online", refreshAfterResume);
    window.addEventListener("offline", pauseWhileOffline);

    return () => {
      socket.off("onlineUsers", onOnlineUsers);
      socket.off("connect", refreshMessagesOnConnect);
      socket.off("disconnect", clearOnlineUsers);
      socket.off("connect_error", clearOnlineUsers);
      socket.off("newMessage", onNewMessage);
      socket.off("messageDeleted", onMessageDeleted);
      document.removeEventListener("visibilitychange", refreshAfterResume);
      window.removeEventListener("online", refreshAfterResume);
      window.removeEventListener("offline", pauseWhileOffline);
      socket.disconnect();
      setOnlineUserIds([]);
    };
  }, [currentUserId, queryClient]);

  const handleSend = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || !selectedUser || !currentUserId || isSending) return;

    const recipientId = selectedUser._id;
    const temporaryId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticMessage: MessageItem = {
      _id: temporaryId,
      senderId: currentUserId,
      receiverId: recipientId,
      message,
      createdAt: new Date().toISOString(),
      deliveryStatus: "sending",
    };

    queryClient.setQueryData<MessageResponse>(
      ["messages", recipientId],
      (current) => appendMessage(current, optimisticMessage),
    );

    sendMessage(
      { userId: recipientId, message },
      {
        onSuccess: ({ newMessage }) => {
          queryClient.setQueryData<MessageResponse>(
            ["messages", recipientId],
            (current) => {
              const messages = (current?.messages ?? []).filter(
                (item) =>
                  item._id !== temporaryId && item._id !== newMessage._id,
              );
              return { success: true, messages: [...messages, newMessage] };
            },
          );
          setDraft((current) => (current === message ? "" : current));
        },
        onError: (error) => {
          queryClient.setQueryData<MessageResponse>(
            ["messages", recipientId],
            (current) =>
              current
                ? {
                    ...current,
                    messages: current.messages.filter(
                      (item) => item._id !== temporaryId,
                    ),
                  }
                : current,
          );
          void queryClient.invalidateQueries({
            queryKey: ["messages", recipientId],
          });
          toast.error(
            error.response?.data.message ?? "Message could not be sent.",
          );
        },
      },
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedUser) return;

    deleteMessage(messageId, {
      onSuccess: () => {
        queryClient.setQueryData<MessageResponse>(
          ["messages", selectedUser._id],
          (current) =>
            current
              ? {
                  ...current,
                  messages: current.messages.filter(
                    (message) => message._id !== messageId,
                  ),
                }
              : current,
        );
        toast.success("Message deleted");
      },
      onError: (error) => {
        toast.error(
          error.response?.data.message ?? "Message could not be deleted.",
        );
      },
    });
  };

  return (
    <section className="mx-auto flex h-[calc(100dvh-9rem)] min-h-0 max-w-5xl overflow-hidden border border-gray-200 bg-white md:h-[calc(100dvh-4rem)] md:min-h-136">
      <MessageInbox
        contacts={contacts}
        selectedUserId={selectedUser?._id}
        onlineUserIds={onlineUserIds}
        search={search}
        isLoading={isUsersLoading}
        isError={isUsersError}
        onSearchChange={setSearch}
        onSelectUser={setSelectedUser}
      />

      <div
        className={`${selectedUser ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}
      >
        {selectedUser ? (
          <>
            <MessageChatHeader
              user={selectedUser}
              isOnline={onlineUserIds.includes(selectedUser._id)}
              onBack={() => setSelectedUser(null)}
            />
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              selectedUser={selectedUser}
              isLoading={areMessagesLoading}
              isDeleting={isDeletingMessage}
              onDelete={handleDeleteMessage}
            />
            <MessageComposer
              value={draft}
              isSending={isSending}
              onChange={setDraft}
              onSubmit={handleSend}
            />
          </>
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center text-center md:flex">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-300">
              <Send size={28} className="text-gray-500" />
            </div>
            <h2 className="text-lg font-light">Your messages</h2>
            <p className="mt-1 text-sm text-gray-500">
              Select someone to start chatting.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Messages;
