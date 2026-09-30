import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import Loader from "@/components/ui/Loader";
import type { MessageItem } from "@/types/message";
import type { UserProfile } from "@/types/users";
import MessageBubble from "./MessageBubble";

type MessageListProps = {
  messages: MessageItem[];
  currentUserId?: string;
  selectedUser: UserProfile;
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: (messageId: string) => void;
};

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameCalendarDay(first?: string, second?: string) {
  const firstDate = parseDate(first);
  const secondDate = parseDate(second);
  return Boolean(
    firstDate &&
    secondDate &&
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate(),
  );
}

function formatMessageDay(value?: string) {
  const date = parseDate(value);
  if (!date) return "Date unavailable";

  const today = new Date();
  if (sameCalendarDay(date.toISOString(), today.toISOString())) return "Today";

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (sameCalendarDay(date.toISOString(), yesterday.toISOString())) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function MessageList({
  messages,
  currentUserId,
  selectedUser,
  isLoading,
  isDeleting,
  onDelete,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex flex-1 flex-col gap-2 overflow-y-auto bg-[#fafafa] px-3 py-4 sm:px-6"
      aria-live="polite"
    >
      {isLoading ? (
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
        messages.map((message, messageIndex) => {
          const previousMessage = messages[messageIndex - 1];
          const startsNewDay =
            !previousMessage ||
            !sameCalendarDay(previousMessage.createdAt, message.createdAt);

          return (
            <div key={message._id} className="flex flex-col gap-2">
              {startsNewDay && (
                <p className="py-3 text-center text-xs font-medium text-gray-500">
                  {formatMessageDay(message.createdAt)}
                </p>
              )}
              <MessageBubble
                message={message}
                isOwnMessage={message.senderId === currentUserId}
                isDeleting={isDeleting}
                onDelete={onDelete}
              />
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
