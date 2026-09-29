import { useProfile } from "@/hooks/users/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Loader from "../ui/Loader";
import { useSuggestedUsers } from "@/hooks/users/useSuggestedUsers";
import { useFollowUser } from "@/hooks/users/useFollow";
import { useUnfollowUser } from "@/hooks/users/useUnFollow";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function RightSidebar() {
  const { data: profileData } = useProfile();
  const { data, isLoading, isError } = useSuggestedUsers();
  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } =
    useUnfollowUser();
  const queryClient = useQueryClient();

  const currentUser = profileData?.user;
  const suggestions = data?.suggestedUsers ?? [];

  const handleFollowToggle = (userId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowUser(userId, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
      });
      return;
    }

    followUser(userId, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
    });
  };

  return (
    <aside className="sticky top-6 hidden w-72 shrink-0 py-8 lg:block">
      <Link to="/profile">
        <div className="mb-6 flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={
                currentUser?.profilePicture ?? "https://github.com/shadcn.png"
              }
              alt="you"
            />
            <AvatarFallback>
              {currentUser?.username?.slice(0, 2).toUpperCase() ?? "CN"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {currentUser?.username ?? "your_username"}
            </p>
            <p className="text-sm text-gray-500">
              {currentUser?.bio ?? "Your name"}
            </p>
          </div>
        </div>
      </Link>

      <p className="mb-3 text-sm font-semibold text-gray-500">
        Suggested for you
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader size={22} />
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600">Suggestions unavailable.</p>
      ) : suggestions.length === 0 ? (
        <p className="text-sm text-gray-500">No suggestions right now.</p>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((user) => {
            const isFollowing =
              currentUser?.followings?.includes(user._id) ?? false;

            return (
              <li key={user._id} className="flex items-center justify-between">
                <Link
                  to={`/profile/${user._id}`}
                  className="flex min-w-0 items-center gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user.profilePicture ?? "https://github.com/shadcn.png"
                      }
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{user.username}</span>
                </Link>
                <button
                  type="button"
                  disabled={isFollowPending || isUnfollowPending}
                  onClick={() => handleFollowToggle(user._id, isFollowing)}
                  className="text-sm font-semibold text-blue-500 disabled:opacity-50"
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

export default RightSidebar;
