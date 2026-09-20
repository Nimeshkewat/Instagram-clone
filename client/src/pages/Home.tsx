import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";

function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl items-start justify-center gap-4 px-0 sm:px-2 lg:gap-10">
      <Feed />
      <RightSidebar />
    </div>
  );
}

export default Home;
