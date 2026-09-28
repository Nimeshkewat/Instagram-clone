import { useState, type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Loader from "../ui/Loader";
import { useFollowerList } from "@/hooks/users/useFollowerList";
import type { FollowListType } from "@/types/users";
import { Button } from "../ui/button";
import { useRemoveFollower, useUnfollowUser } from "@/hooks/users/useUnFollow";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types/error";

type Props = {
  type: FollowListType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function FollowingAndFollowersDialog({ type, open, setOpen }: Props) {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useFollowerList(type);
  const users = data?.list ?? [];
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollowUser();
  const { mutate: removeFollower, isPending: isRemoving } = useRemoveFollower();
  const isPending = isUnfollowing || isRemoving;
  const queryClient = useQueryClient();

  const handleRemoveUser = (userId: string) => {
    const options = {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["follow-list", type] }),
          queryClient.invalidateQueries({ queryKey: ["profile"] }),
          queryClient.invalidateQueries({ queryKey: ["suggested-users"] }),
        ]);
        toast.success(
          type === "followers" ? "Follower removed" : "User unfollowed",
        );
      },
      onError: (error: ApiError) => {
        toast.error(
          error.response?.data?.message ?? "Could not update this user.",
        );
      },
    };

    if (type === "followers") {
      removeFollower(userId, options);
    } else {
      unfollowUser(userId, options);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            className="pl-10 focus-visible:ring-transparent"
          />
        </div>

        <div className="max-h-80 min-h-24 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size={24} />
            </div>
          ) : isError ? (
            <p className="py-8 text-center text-sm text-red-600">
              Unable to load this list.
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {users.length === 0
                ? `No ${type === "followers" ? "followers" : "following"} yet.`
                : "No users match your search."}
            </p>
          ) : (
            <ul className="w-full space-y-3 py-2">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold">
                      {user.username}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 shrink-0 rounded-lg px-4 text-xs font-semibold"
                    onClick={() => handleRemoveUser(user._id)}
                    disabled={isPending}
                  >
                    {isPending
                      ? type === "followers"
                        ? "Removing..."
                        : "Unfollowing..."
                      : type === "followers"
                        ? "Remove"
                        : "Unfollow"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FollowingAndFollowersDialog;
