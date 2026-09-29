import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, MessageCircle, Search, Send } from "lucide-react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { useMessages } from "@/hooks/messages/useMessages";
import { useSendMessage } from "@/hooks/messages/useSendMessage";
import { useProfile } from "@/hooks/users/useProfile";
import { useSuggestedUsers } from "@/hooks/users/useSuggestedUsers";
import type { MessageItem, MessageResponse } from "@/api/messages/messages";
import type { UserProfile } from "@/types/users";
import { toast } from "sonner";

const socketUrl = new URL(
  import.meta.env.VITE_BASE_URL || window.location.origin,
  window.location.origin,
).origin;

function formatMessageTime(date?: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
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
  const [socketConnected, setSocketConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
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

  const currentUserId = profileData?.user._id;
  const contacts = (usersData?.suggestedUsers ?? []).filter((user) =>
    user.username.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const messages = messagesData?.messages ?? [];

  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(socketUrl, { withCredentials: true });
    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);
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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onDisconnect);
    socket.on("newMessage", onNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onDisconnect);
      socket.off("newMessage", onNewMessage);
      socket.disconnect();
      setSocketConnected(false);
    };
  }, [currentUserId, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || !selectedUser || !currentUserId || isSending) return;

    sendMessage(
      { userId: selectedUser._id, message },
      {
        onSuccess: ({ newMessage }) => {
          queryClient.setQueryData<MessageResponse>(
            ["messages", selectedUser._id],
            (current) => appendMessage(current, newMessage),
          );
          setDraft("");
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message ?? "Message could not be sent.",
          );
        },
      },
    );
  };

  return (
    <section className="mx-auto flex h-[calc(100dvh-9rem)] min-h-112 max-w-5xl overflow-hidden border border-gray-200 bg-white md:h-[calc(100dvh-4rem)] md:min-h-136">
      <aside
        className={`${selectedUser ? "hidden md:flex" : "flex"} w-full shrink-0 flex-col border-r border-gray-200 md:w-80 lg:w-96`}
      >
        <div className="border-b border-gray-200 px-4 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Messages</h1>
            <span
              className={`flex items-center gap-1.5 text-xs ${socketConnected ? "text-emerald-600" : "text-gray-400"}`}
              aria-label={socketConnected ? "Live connection" : "Connecting"}
            >
              <span
                className={`h-2 w-2 rounded-full ${socketConnected ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              {socketConnected ? "Live" : "Connecting"}
            </span>
          </div>
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search people"
              aria-label="Search people"
              className="h-9 border-0 bg-gray-100 pl-9 focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isUsersLoading ? (
            <div className="flex justify-center py-10">
              <Loader size={24} />
            </div>
          ) : isUsersError ? (
            <p className="px-4 py-8 text-center text-sm text-red-600">
              Could not load people.
            </p>
          ) : contacts.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">
              {search
                ? "No people match your search."
                : "No people to message yet."}
            </p>
          ) : (
            <ul>
              {contacts.map((user) => (
                <li key={user._id}>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${selectedUser?._id === user._id ? "bg-gray-50" : ""}`}
                  >
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {user.username}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <div
        className={`${selectedUser ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}
      >
        {selectedUser ? (
          <>
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 px-3 sm:px-5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Back to messages"
                onClick={() => setSelectedUser(null)}
              >
                <ArrowLeft size={20} />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={selectedUser.profilePicture}
                  alt={selectedUser.username}
                />
                <AvatarFallback>
                  {selectedUser.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {selectedUser.username}
                </p>
                <p className="text-xs text-gray-500">Conversation</p>
              </div>
            </header>

            <div
              className="flex flex-1 flex-col gap-2 overflow-y-auto bg-[#fafafa] px-3 py-4 sm:px-6"
              aria-live="polite"
            >
              {areMessagesLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <Loader size={24} />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-gray-300">
                    <MessageCircle size={26} className="text-gray-500" />
                  </div>
                  <p className="text-sm font-semibold">Start a conversation</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Send a message to {selectedUser.username}.
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === currentUserId;
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2 sm:max-w-[70%] ${isOwnMessage ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-gray-200 bg-white text-gray-900"}`}
                      >
                        <p className="whitespace-pre-wrap wrap-break-word text-sm">
                          {message.message}
                        </p>
                        <p
                          className={`mt-1 text-right text-[10px] ${isOwnMessage ? "text-blue-100" : "text-gray-400"}`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="flex shrink-0 items-end gap-2 border-t border-gray-200 bg-white p-3 sm:px-5 sm:py-4"
            >
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Message..."
                aria-label="Write a message"
                autoComplete="off"
                className="h-11 rounded-full bg-gray-50 px-4"
                maxLength={2000}
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-full"
                disabled={!draft.trim() || isSending}
                aria-label="Send message"
              >
                {isSending ? <Loader size={18} /> : <Send size={18} />}
              </Button>
            </form>
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
