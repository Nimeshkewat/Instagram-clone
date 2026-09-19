import {
  Bookmark,
  Dot,
  Ellipsis,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import type { PostType } from "@/types/post";

type PostProps = {
  post: PostType;
};

function Post({ post }: PostProps) {
  return (
    <article className="mx-auto my-6 flex w-full max-w-117.5 flex-col">
      {/* header */}
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex items-center gap-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.avatar} alt={post.username} />
            <AvatarFallback>
              {post.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="ml-2 text-sm font-semibold">{post.username}</h2>
          <span className="flex items-center text-sm text-gray-500">
            <Dot size={16} />
            {post.createdAgo}
          </span>
        </div>
        <button type="button" aria-label="More options">
          <Ellipsis />
        </button>
      </div>

      {/* image */}
      <div className="overflow-hidden sm:rounded-md">
        <img
          src={post.image}
          alt={post.caption}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      </div>

      {/* actions */}
      <div className="flex flex-col space-y-1 px-3">
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Like">
              <Heart className="transition hover:scale-105" size={26} />
            </button>
            <button
              type="button"
              aria-label="Comments"
              className="flex items-center gap-1"
            >
              <MessageCircle size={26} className="transition hover:scale-105" />
              <span className="text-sm">{post.comments}</span>
            </button>
            <button type="button" aria-label="Share">
              <Send size={24} className="transition hover:scale-105" />
            </button>
          </div>
          <button type="button" aria-label="Save">
            <Bookmark size={24} className="transition hover:scale-105" />
          </button>
        </div>

        {post.likedBy?.length ? (
          <p className="mt-1 text-sm">
            Liked by <span className="font-semibold">{post.likedBy[0]}</span>
            {post.likedBy.length > 1 && (
              <>
                {" "}
                and <span className="font-semibold">{post.likedBy[1]}</span>
              </>
            )}
          </p>
        ) : null}

        <p className="text-sm">
          <span className="mr-1 font-semibold">{post.username}</span>
          {post.caption}
        </p>
      </div>
    </article>
  );
}

export default Post;
