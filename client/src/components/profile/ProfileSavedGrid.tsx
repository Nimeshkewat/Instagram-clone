import { useState } from "react";
import { BookmarkMinus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import type { PostItem } from "@/types/post";
import ProfilePostDialog from "./ProfilePostDialog";
import { useGetBookmarkPosts } from "@/hooks/posts/useGetBookmarks";
import { useBookmarkPost } from "@/hooks/posts/useBookmarkPost";

function ProfileSavedGrid() {
  const { data, isLoading, isError } = useGetBookmarkPosts();
  const { mutate: toggleBookmark, isPending } = useBookmarkPost();
  const queryClient = useQueryClient();
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

  const handleUnsave = (postId: string) => {
    toggleBookmark(postId, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["bookmark-posts"] }),
          queryClient.invalidateQueries({ queryKey: ["feed-posts"] }),
        ]);
        toast.success("Post removed from saved");
      },
      onError: () => toast.error("Could not remove saved post."),
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {posts.map((post) => (
          <div
            key={post._id}
            className="group relative aspect-square overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setSelectedPost(post)}
              className="absolute inset-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-inset"
              aria-label={`Open saved post${post.caption ? `: ${post.caption}` : ""}`}
            >
              <img
                src={post.image}
                alt={post.caption || "Saved post"}
                loading="lazy"
                className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="font-semibold">
                  ♥ {post.likes?.length ?? 0}
                </span>
                <span className="font-semibold">
                  💬 {post.comments?.length ?? 0}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleUnsave(post._id)}
              disabled={isPending}
              aria-label="Remove saved post"
              title="Remove saved post"
              className="absolute right-2 top-2 z-10 rounded-full bg-white/95 p-2 text-gray-900 shadow transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
            >
              <BookmarkMinus className="size-3 md:size-8" />
            </button>
          </div>
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
