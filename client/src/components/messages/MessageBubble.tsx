import { useState } from "react";
import { Ellipsis, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { MessageItem } from "@/types/message";

type MessageBubbleProps = {
  message: MessageItem;
  isOwnMessage: boolean;
  isDeleting: boolean;
  onDelete: (messageId: string) => void;
};

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatMessageTime(value?: string) {
  const date = parseDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function MessageBubble({
  message,
  isOwnMessage,
  isDeleting,
  onDelete,
}: MessageBubbleProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div
        className={`group flex w-full items-center gap-1.5 ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        {isOwnMessage && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Message options"
            title="Delete message"
            disabled={isDeleting}
            onClick={() => setConfirmDelete(true)}
            className="shrink-0 text-gray-500 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          >
            <Ellipsis />
          </Button>
        )}
        <div
          className={`max-w-[82%] rounded-2xl px-3.5 py-2 sm:max-w-[70%] ${isOwnMessage ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-gray-200 bg-white text-gray-900"}`}
        >
          <p className="whitespace-pre-wrap wrap-break-word text-sm">
            {message.message}
          </p>
          <time
            className={`mt-1 block text-right text-[10px] ${isOwnMessage ? "text-blue-100" : "text-gray-400"}`}
            dateTime={message.createdAt}
            title={formatMessageTime(message.createdAt)}
          >
            {formatMessageTime(message.createdAt)}
          </time>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the message for everyone in this conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                setConfirmDelete(false);
                onDelete(message._id);
              }}
            >
              <Trash2 />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default MessageBubble;
