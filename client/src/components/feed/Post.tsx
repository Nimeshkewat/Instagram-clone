import {
  Bookmark,
  Dot,
  Ellipsis,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import type { GetPostsResponse, PostItem } from "@/types/post";
import CommentsDialog from "./CommentsDialog";
import { useState } from "react";
import { useLikePost } from "@/hooks/posts/useLikePost";
import { useDislikePost } from "@/hooks/posts/useDislikePost";
import { useQueryClient } from "@tanstack/react-query";
import { useBookmarkPost } from "@/hooks/posts/useBookmarkPost";
import { useProfile } from "@/hooks/users/useProfile";
import { Link } from "react-router-dom";
import type { ProfileResponse } from "@/types/users";

type PostProps = {
  post: PostItem;
};

function formatRelativeTime(date?: string) {
  if (!date) return "just now";

  const minutes = Math.max(
    1,
    Math.floor((Date.now() - new Date(date).getTime()) / 60000),
  );
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
}

function Post({ post }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const author = typeof post.author === "string" ? null : post.author;
  const authorId = typeof post.author === "string" ? post.author : author?._id;
  const username = author?.username ?? "you";
  const avatar = author?.profilePicture ?? "https://github.com/shadcn.png";
  const { data: profileData } = useProfile();
  const liked = Boolean(
    profileData?.user._id && post.likes?.includes(profileData.user._id),
  );
  const saved = Boolean(profileData?.user.bookmarks?.includes(post._id));

  const { mutate: likePost, isPending: isLikePending } = useLikePost();
  const { mutate: dislikePost, isPending: isDislikePending } = useDislikePost();
  const { mutate: bookmarkPost, isPending: isBookmarkPending } =
    useBookmarkPost();
  const queryClient = useQueryClient();

  const handleLike = () => {
    const userId = profileData?.user._id;
    if (!userId) return;

    const mutation = liked ? dislikePost : likePost;
    const queryKeys = [["posts"], ["feed-posts"]] as const;
    const previousPosts = queryKeys.map(
      (queryKey) =>
        [
          queryKey,
          queryClient.getQueryData<GetPostsResponse>(queryKey),
        ] as const,
    );

    for (const [queryKey] of previousPosts) {
      queryClient.setQueryData<GetPostsResponse>(queryKey, (current) =>
        current
          ? {
              ...current,
              posts: current.posts.map((item) =>
                item._id !== post._id
                  ? item
                  : {
                      ...item,
                      likes: liked
                        ? (item.likes ?? []).filter((id) => id !== userId)
                        : [...new Set([...(item.likes ?? []), userId])],
                    },
              ),
            }
          : current,
      );
    }

    mutation(post._id, {
      onError: () => {
        for (const [queryKey, previous] of previousPosts) {
          if (previous) queryClient.setQueryData(queryKey, previous);
        }
      },
      onSettled: async () => {
        await Promise.all(
          queryKeys.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ),
        );
      },
    });
  };

  const handleSave = () => {
    const previousProfile = queryClient.getQueryData<ProfileResponse>([
      "profile",
    ]);
    const bookmarks = previousProfile?.user.bookmarks ?? [];
    const nextBookmarks = saved
      ? bookmarks.filter((id) => id !== post._id)
      : [...new Set([...bookmarks, post._id])];

    if (previousProfile) {
      queryClient.setQueryData<ProfileResponse>(["profile"], {
        ...previousProfile,
        user: { ...previousProfile.user, bookmarks: nextBookmarks },
      });
    }

    bookmarkPost(post._id, {
      onError: () => {
        if (previousProfile) {
          queryClient.setQueryData(["profile"], previousProfile);
        }
      },
      onSettled: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["profile"] }),
          queryClient.invalidateQueries({ queryKey: ["posts"] }),
          queryClient.invalidateQueries({ queryKey: ["feed-posts"] }),
          queryClient.invalidateQueries({ queryKey: ["bookmark-posts"] }),
        ]);
      },
    });
  };

  return (
    <article className="mx-auto my-6 flex w-full max-w-117.5 flex-col">
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex items-center gap-1">
          <Link
            to={
              profileData?.user._id !== authorId
                ? `/profile/${authorId}`
                : "/profile"
            }
            className="flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback>
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-sm font-semibold">{username}</h2>
          </Link>
          <span className="flex items-center text-sm text-gray-500">
            <Dot size={16} />
            {formatRelativeTime(post.createdAt)}
          </span>
        </div>
        <button type="button" aria-label="More options">
          <Ellipsis />
        </button>
      </div>

      <div className="overflow-hidden sm:rounded-md">
        <img
          src={post.image}
          alt={post.caption}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      </div>

      <div className="flex flex-col space-y-1 px-3">
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Like"
              disabled={isLikePending || isDislikePending}
              onClick={handleLike}
            >
              <Heart
                className={
                  liked
                    ? "fill-red-500 text-red-500"
                    : "transition hover:scale-105"
                }
                size={26}
              />
            </button>
            <button
              type="button"
              aria-label="Comments"
              className="flex items-center gap-1"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle size={26} className="transition hover:scale-105" />
              <span className="text-sm">{post.comments?.length ?? 0}</span>
            </button>
            <button type="button" aria-label="Share">
              <Send size={24} className="transition hover:scale-105" />
            </button>
          </div>
          <button
            type="button"
            aria-label="Save"
            aria-pressed={saved}
            disabled={isBookmarkPending}
            onClick={handleSave}
          >
            <Bookmark
              size={24}
              fill={saved ? "#000000" : "none"}
              className={
                saved ? "fill-black text-black" : "transition hover:scale-105"
              }
            />
          </button>
        </div>

        {post.likes?.length ? (
          <p className="mt-1 text-sm">{post.likes.length} likes</p>
        ) : null}

        <p className="text-sm">
          <span className="mr-1 font-semibold">{username}</span>
          {post.caption}
        </p>
      </div>

      <CommentsDialog
        open={showComments}
        onClose={() => setShowComments(false)}
        postId={post._id}
        postImage={post.image}
        postOwner={username}
        postOwnerAvatar={avatar}
        postCaption={post.caption}
        createdAt={post.createdAt!}
      />
    </article>
  );
}

export default Post;
