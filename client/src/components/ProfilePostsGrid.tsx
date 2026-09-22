import { useState } from "react";
import type { PostItem } from "../types/post";
import ProfilePostDialog from "./profile/ProfilePostDialog";

type ProfilePostsGridProps = {
  posts: PostItem[];
};

function ProfilePostsGrid({ posts }: ProfilePostsGridProps) {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  if (posts.length === 0) {
    return (
      <div className="col-span-3 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        No posts yet.
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
            aria-label={`Open post${post.caption ? `: ${post.caption}` : ""}`}
          >
            <img
              src={post.image}
              alt={post.caption || "user post"}
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
      />
    </>
  );
}

export default ProfilePostsGrid;
