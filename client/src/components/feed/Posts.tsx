import Post from "./Post";
import { usePosts } from "@/hooks/posts/usePosts";
import Loader from "../ui/Loader";

function Posts() {
  const { data, isLoading, isError, error } = usePosts("feed");

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
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
