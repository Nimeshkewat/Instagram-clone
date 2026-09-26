import { useEffect } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import type { PostItem } from "@/types/post";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PostOptionsMenu from "../posts/PostOptionsMenu";
import { useQueryClient } from "@tanstack/react-query";

type ProfilePostDialogProps = {
  post: PostItem | null;
  onClose: () => void;
};

function ProfilePostDialog({ post, onClose }: ProfilePostDialogProps) {
  const { mutate: deletePost, isPending } = useDeletePost();
  const queryClient = useQueryClient();
  const author =
    post?.author && typeof post.author !== "string" ? post.author : null;
  const username = author?.username ?? "you";
  const avatar = author?.profilePicture ?? "https://github.com/shadcn.png";

  useEffect(() => {
    if (!post) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onClose, post]);

  if (!post) return null;

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete this post? This action cannot be undone.",
    );

    if (!confirmed) return;

    deletePost(post._id, {
      onSuccess: async () => {
        toast.success("Post deleted successfully");
        onClose();
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["posts"] }),
          queryClient.invalidateQueries({ queryKey: ["feed-posts"] }),
        ]);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ?? "Unable to delete this post.",
        );
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6"
      onClick={() => !isPending && onClose()}
      role="presentation"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white sm:flex-row sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Post details"
      >
        <div className="flex min-h-0 flex-1 items-center justify-center bg-black sm:min-h-130">
          <img
            src={post.image}
            alt={post.caption || "Post"}
            className="max-h-[58vh] w-full object-contain sm:max-h-[78vh]"
          />
        </div>

        <div className="flex w-full flex-col sm:max-w-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback>
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">{username}</span>
            </div>
            <div className="flex items-center gap-1">
              <PostOptionsMenu
                disabled={isPending}
                onEdit={() => toast.info("Post editing is coming soon.")}
                onDelete={handleDelete}
              />
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                aria-label="Close post"
                className="rounded-full p-1 transition hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-sm">
              <span className="mr-1 font-semibold">{username}</span>
              {post.caption || "No caption"}
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm">
                <Heart size={20} /> {post.likes?.length ?? 0}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <MessageCircle size={20} /> {post.comments?.length ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePostDialog;
