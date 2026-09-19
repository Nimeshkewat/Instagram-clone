import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";

function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl items-start justify-center gap-10 px-0 sm:px-4">
      <Feed />
      <RightSidebar />
    </div>
  );
}

export default Home;
