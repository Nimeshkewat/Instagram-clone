import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import type { UserProfile } from "@/types/users";

type MessageInboxProps = {
  contacts: UserProfile[];
  selectedUserId?: string;
  onlineUserIds: string[];
  search: string;
  isLoading: boolean;
  isError: boolean;
  onSearchChange: (value: string) => void;
  onSelectUser: (user: UserProfile) => void;
};

function MessageInbox({
  contacts,
  selectedUserId,
  onlineUserIds,
  search,
  isLoading,
  isError,
  onSearchChange,
  onSelectUser,
}: MessageInboxProps) {
  return (
    <aside
      className={`${selectedUserId ? "hidden md:flex" : "flex"} w-full shrink-0 flex-col border-r border-gray-200 md:w-80 lg:w-96`}
    >
      <div className="border-b border-gray-200 px-4 py-5">
        <h1 className="mb-4 text-xl font-semibold">Messages</h1>
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search people"
            aria-label="Search people"
            className="h-9 border-0 bg-gray-100 pl-9 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader size={24} />
          </div>
        ) : isError ? (
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
            {contacts.map((user) => {
              const isOnline = onlineUserIds.includes(user._id);
              return (
                <li key={user._id}>
                  <button
                    type="button"
                    onClick={() => onSelectUser(user)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${selectedUserId === user._id ? "bg-gray-50" : ""}`}
                  >
                    <span className="relative h-12 w-12 shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user.profilePicture}
                          alt={user.username}
                        />
                        <AvatarFallback>
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <span
                          aria-label="Online"
                          className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {user.username}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default MessageInbox;
