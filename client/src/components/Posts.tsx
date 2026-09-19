import Post from "./Post";
import type { PostType } from "@/types/post";

const mockPosts: PostType[] = [1, 2, 3, 4].map((id) => ({
  id,
  username: `user_${id}`,
  avatar: "https://github.com/shadcn.png",
  image:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  caption: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  comments: 20,
  likedBy: ["user", "other"],
  createdAgo: "16h",
}));

function Posts() {
  return (
    <div className="flex flex-col">
      {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
