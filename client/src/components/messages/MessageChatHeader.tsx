import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/types/users";

type MessageChatHeaderProps = {
  user: UserProfile;
  isOnline: boolean;
  onBack: () => void;
};

function MessageChatHeader({ user, isOnline, onBack }: MessageChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 px-3 sm:px-5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Back to messages"
        onClick={onBack}
      >
        <ArrowLeft size={20} />
      </Button>
      <span className="relative h-10 w-10 shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profilePicture} alt={user.username} />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        )}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{user.username}</p>
        <p className="text-xs text-gray-500">Conversation</p>
      </div>
    </header>
  );
}

export default MessageChatHeader;
