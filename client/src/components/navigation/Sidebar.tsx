import { useState, type ReactNode } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircleIcon,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLogout } from "@/hooks/users/useLogout";
import { useProfile } from "@/hooks/users/useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "../ui/Loader";
import CreatePostDialog from "../posts/CreatePostDialog";

type SidebarItem = {
  name: string;
  icon: ReactNode;
  mobile: boolean;
};

function Sidebar() {
  const [showCreate, setShowCreate] = useState(false);

  const { mutate, isPending } = useLogout();
  const { data: profileData } = useProfile();
  const navigate = useNavigate();
  const currentUser = profileData?.user;

  const sidebarItems: SidebarItem[] = [
    { name: "Home", icon: <Home />, mobile: true },
    { name: "Search", icon: <Search />, mobile: true },
    { name: "Explore", icon: <TrendingUp />, mobile: false },
    { name: "Messages", icon: <MessageCircleIcon />, mobile: true },
    { name: "Notifications", icon: <Heart />, mobile: false },
    { name: "Create", icon: <PlusSquare />, mobile: true },
    {
      name: "Profile",
      icon: (
        <Avatar className="h-7 w-7">
          <AvatarImage
            src={currentUser?.profilePicture ?? "https://github.com/shadcn.png"}
            alt="profile"
          />
          <AvatarFallback>
            {currentUser?.username?.slice(0, 2).toUpperCase() ?? "CN"}
          </AvatarFallback>
        </Avatar>
      ),
      mobile: true,
    },
    { name: "Logout", icon: <LogOut />, mobile: false },
  ];

  const handleClick = (action: string) => {
    if (action === "Home") navigate("/");
    if (action === "Profile") navigate("/profile");
    if (action === "Create") {
      setShowCreate(true);
      return;
    }
    if (action === "Search" || action === "Explore") {
      toast.info("Search is coming soon");
      return;
    }
    if (action === "Messages" || action === "Notifications") {
      toast.info("This section is being built");
      return;
    }
    if (action !== "Logout") return;

    mutate(null, {
      onSuccess: () => {
        navigate("/login");
        toast.success("Logout successful");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ??
            "Something went wrong. Please try again later.",
        );
      },
    });
  };

  return (
    <>
      <CreatePostDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {/* Desktop / tablet:*/}
      <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-16 flex-col border-r border-gray-300 bg-white md:flex lg:w-60">
        <h1 className="my-8 text-center text-xl font-bold lg:ml-5 lg:text-left">
          <span className="lg:hidden">IG</span>
          <span className="hidden lg:inline">
            {currentUser?.username ?? "LOGO"}
          </span>
        </h1>

        <nav className="flex flex-col px-2">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleClick(item.name)}
              disabled={item.name === "Logout" && isPending}
              className="my-1 flex items-center justify-center gap-3 rounded-md px-3 py-3 transition hover:bg-gray-100 lg:justify-start"
              title={item.name}
            >
              {isPending && item.name === "Logout" ? (
                <Loader size={26} />
              ) : (
                item.icon
              )}
              <span className="hidden lg:inline">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile: top bar + bottom nav */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <h1 className="text-xl font-bold">{currentUser?.username ?? "LOGO"}</h1>
        <button
          type="button"
          onClick={() => handleClick("Logout")}
          disabled={isPending}
          aria-label="Logout"
        >
          {isPending ? <Loader size={22} /> : <LogOut size={22} />}
        </button>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-gray-200 bg-white md:hidden">
        {sidebarItems
          .filter((item) => item.mobile)
          .map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleClick(item.name)}
              className="p-2"
              aria-label={item.name}
            >
              {item.icon}
            </button>
          ))}
      </nav>
    </>
  );
}

export default Sidebar;
