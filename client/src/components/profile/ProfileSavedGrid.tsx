import { useState } from "react";
import Loader from "@/components/ui/Loader";
import type { PostItem } from "@/types/post";
import ProfilePostDialog from "./ProfilePostDialog";
import { useGetBookmarkPosts } from "@/hooks/posts/useGetBookmarks";

function ProfileSavedGrid() {
  const { data, isLoading, isError } = useGetBookmarkPosts();
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const posts =
    data?.bookmarks.flatMap((collection) =>
      collection.bookmarks.filter((post): post is PostItem => post !== null),
    ) ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <Loader size={28} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Unable to load saved posts.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        No saved posts yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {posts.map((post) => (
          <button
            key={post._id}
            type="button"
            onClick={() => setSelectedPost(post)}
            className="group relative aspect-square overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            aria-label={`Open saved post${post.caption ? `: ${post.caption}` : ""}`}
          >
            <img
              src={post.image}
              alt={post.caption || "Saved post"}
              loading="lazy"
              className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="font-semibold text-white">
                ♥ {post.likes?.length ?? 0}
              </span>
              <span className="font-semibold text-white">
                💬 {post.comments?.length ?? 0}
              </span>
            </div>
          </button>
        ))}
      </div>

      <ProfilePostDialog
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        canDelete={false}
      />
    </>
  );
}

export default ProfileSavedGrid;
