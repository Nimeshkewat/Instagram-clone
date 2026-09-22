import Post from "./Post";
import type { PostType } from "@/types/post";
import { usePosts } from "@/hooks/posts/usePosts";
import Loader from "../ui/Loader";

function formatRelativeTime(date?: string) {
  if (!date) return "just now";

  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function normalizePost(post: any): PostType {
  const author = typeof post.author === "string" ? null : post.author;

  return {
    id: post._id,
    username: author?.username ?? "you",
    avatar: author?.profilePicture ?? "https://github.com/shadcn.png",
    image: post.image ?? "",
    caption: post.caption ?? "",
    comments: Array.isArray(post.comments) ? post.comments.length : 0,
    likedBy: Array.isArray(post.likes)
      ? post.likes.slice(0, 2).map(() => "you")
      : [],
    createdAgo: formatRelativeTime(post.createdAt),
  };
}

function Posts() {
  const { data, isLoading, isError, error } = usePosts();

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
        {error?.message ?? "Unable to load posts right now."}
      </div>
    );
  }

  const posts = data?.posts ?? [];

  if (!posts.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
        No posts yet. Share your first photo to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <Post key={post._id} post={normalizePost(post)} />
      ))}
    </div>
  );
}

export default Posts;
