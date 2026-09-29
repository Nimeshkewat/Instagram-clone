import { useState } from "react";
import { X, Heart, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePostComments } from "@/hooks/comments/useComments";
import { useAddComment } from "@/hooks/comments/useAddComment";
import Loader from "../ui/Loader";
import { useQueryClient } from "@tanstack/react-query";

type CommentsDialogProps = {
  open: boolean;
  onClose: () => void;
  postId: string;
  postImage: string;
  postOwner: string;
  postOwnerAvatar?: string;
  postCaption: string;
  createdAt: string;
};

function formatRelativeTime(date?: string) {
  if (!date) return "now";

  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function CommentsDialog({
  open,
  onClose,
  postId,
  postImage,
  postOwner,
  postOwnerAvatar,
  postCaption,
  createdAt,
}: CommentsDialogProps) {
  const [input, setInput] = useState("");
  const { data, isLoading, isError } = usePostComments(postId);
  const { mutate, isPending } = useAddComment();
  const queryClient = useQueryClient();

  if (!open) return null;

  const comments = data?.comments ?? [];

  const handlePost = () => {
    if (!input.trim() || !postId) return;

    mutate(
      { postId, text: input.trim() },
      {
        onSuccess: async () => {
          setInput("");
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["comments", postId],
            }),
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] }),
            queryClient.invalidateQueries({ queryKey: ["posts"] }),
          ]);
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white sm:h-[80vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-sm font-semibold text-gray-400">Comments</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden shrink-0 sm:block sm:w-90">
            <img
              src={postImage}
              alt="post"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={postOwnerAvatar} alt={postOwner} />
                  <AvatarFallback>
                    {postOwner.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="mr-1 font-semibold">{postOwner}</span>
                    {postCaption}
                  </p>
                  <span className="mt-1 text-xs text-gray-400">
                    {formatRelativeTime(createdAt)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {isLoading ? (
                <div className="flex min-h-30 items-center justify-center">
                  <Loader size={24} />
                </div>
              ) : isError ? (
                <div className="text-sm text-red-600">
                  We could not load comments.
                </div>
              ) : comments.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No comments yet. Be the first to comment.
                </div>
              ) : (
                comments.map((comment) => {
                  const author = comment.author ?? { username: "user" };

                  return (
                    <div key={comment._id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                          src={
                            author.profilePicture ??
                            "https://github.com/shadcn.png"
                          }
                          alt={author.username}
                        />
                        <AvatarFallback>
                          {author.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="mr-1 font-semibold">
                            {author.username}
                          </span>
                          {comment.text}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                          <span>{formatRelativeTime(comment.createdAt)}</span>
                          <button
                            type="button"
                            className="font-semibold hover:text-gray-600"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Like comment"
                        className="shrink-0 pt-0.5"
                      >
                        <Heart size={14} className="text-gray-400" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-gray-200 px-3 py-3">
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Emoji">
                  <Smile size={22} className="text-gray-400" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePost()}
                  placeholder="Add a comment…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={handlePost}
                  disabled={!input.trim() || isPending}
                  className="text-sm font-semibold text-blue-500 disabled:opacity-40"
                >
                  {isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsDialog;
