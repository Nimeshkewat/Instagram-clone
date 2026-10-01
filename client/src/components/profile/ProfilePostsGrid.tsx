import { useState } from "react";
import type { PostItem } from "@/types/post";
import ProfilePostDialog from "./ProfilePostDialog";

function formatTimeAgo(value?: string) {
  if (!value) return "";
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return "";

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / 60000),
  );
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  return `${Math.floor(days / 365)}y`;
}

type ProfilePostsGridProps = {
  posts: PostItem[];
  canDelete?: boolean;
};

function ProfilePostsGrid({ posts, canDelete = true }: ProfilePostsGridProps) {
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
            {post.createdAt && (
              <span
                title={new Date(post.createdAt).toLocaleString()}
                className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white"
              >
                {formatTimeAgo(post.createdAt)}
              </span>
            )}
          </button>
        ))}
      </div>

      <ProfilePostDialog
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        canDelete={canDelete}
      />
    </>
  );
}

export default ProfilePostsGrid;
