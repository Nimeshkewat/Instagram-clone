import { useState } from "react";
import { Grid3x3, Bookmark, Film, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/users/useProfile";
import { usePosts } from "@/hooks/posts/usePosts";
import Loader from "@/components/ui/Loader";

const TABS = [
  { id: "posts", label: "Posts", icon: <Grid3x3 size={16} /> },
  { id: "reels", label: "Reels", icon: <Film size={16} /> },
  { id: "saved", label: "Saved", icon: <Bookmark size={16} /> },
];

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfile();
  const { data: postsData } = usePosts();

  const user = profileData?.user;
  const posts = postsData?.posts ?? [];

  if (isProfileLoading) {
    return (
      <div className="flex min-h-65 items-center justify-center">
        <Loader size={28} />
      </div>
    );
  }

  if (isProfileError || !user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Unable to load your profile.
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-2 py-4 sm:px-4 sm:py-8">
      <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="flex justify-center sm:block sm:shrink-0">
          <Avatar className="h-24 w-24 ring-2 ring-gray-200 ring-offset-2 sm:h-36 sm:w-36">
            <AvatarImage
              src={user.profilePicture ?? "https://github.com/shadcn.png"}
              alt={user.username}
            />
            <AvatarFallback className="text-2xl">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-center text-xl font-semibold sm:text-left">
              {user.username}
            </h1>
            <div className="flex justify-center gap-2 sm:justify-start">
              <button
                type="button"
                className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-semibold transition hover:bg-gray-200"
              >
                Edit profile
              </button>
              <button
                type="button"
                className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-semibold transition hover:bg-gray-200"
              >
                Share profile
              </button>
              <button
                type="button"
                aria-label="Settings"
                className="rounded-lg bg-gray-100 p-1.5 transition hover:bg-gray-200"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-8 sm:justify-start">
            <Stat count={posts.length} label="posts" />
            <Stat count={user.followers?.length ?? 0} label="followers" />
            <Stat count={user.followings?.length ?? 0} label="following" />
          </div>

          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold">{user.username}</p>
            <p className="mt-1 max-w-xs text-sm text-gray-700">
              {user.bio ?? "No bio yet."}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-4 overflow-x-auto pb-2 sm:gap-6">
        {["Travel", "Food", "Pets", "Friends", "Events"].map((label) => (
          <div
            key={label}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-gray-300 ring-offset-2">
              <img
                src={`https://picsum.photos/seed/${label}/80/80`}
                alt={label}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 border-t-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition sm:text-xs ${
                activeTab === tab.id
                  ? "border-gray-800 text-gray-800"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "posts" && (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
          {posts.length === 0 ? (
            <div className="col-span-3 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
              No posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="group relative aspect-square">
                <img
                  src={post.image}
                  alt={post.caption || "user post"}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition group-hover:opacity-100 sm:group-hover:opacity-100">
                  <span className="font-semibold text-white">
                    ♥ {post.likes?.length ?? 0}
                  </span>
                  <span className="font-semibold text-white">
                    💬 {post.comments?.length ?? 0}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ count, label }: { count: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center sm:flex-row sm:gap-1">
      <span className="font-semibold">{count}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

export default Profile;
