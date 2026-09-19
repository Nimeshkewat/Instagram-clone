import {
  Heart,
  Home,
  LogOut,
  MessageCircleIcon,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useLogout } from "@/hooks/users/useLogout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "./ui/Loader";

const sidebarItems = [
  { name: "Home", icon: <Home /> },
  { name: "Search", icon: <Search /> },
  { name: "Explore", icon: <TrendingUp /> },
  { name: "Messages", icon: <MessageCircleIcon /> },
  { name: "Notifications", icon: <Heart /> },
  { name: "Create", icon: <PlusSquare /> },
  {
    name: "Profile",
    icon: (
      <Avatar className="w-7 h-7">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
  },
  { name: "Logout", icon: <LogOut /> },
];

function Sidebar() {
  const { mutate, isPending } = useLogout();
  const navigate = useNavigate();

  const handleLogout = (action: string) => {
    if (action === "Logout") {
      mutate(null, {
        onSuccess: () => {
          navigate("/login");
          toast.success("Logout successful");
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message ||
              ' "Something went wrong. Please try again later."',
          );
        },
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 pr-4  border-r border-r-gray-300 w-62 h-screen">
      <h1 className="ml-5">LOGI</h1>
      <div>
        {sidebarItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleLogout(item.name)}
            className="flex items-center gap-3 py-3 px-4 my-3 hover:bg-gray-100 hover:scale-102 rounded-md transition cursor-pointer"
          >
            {isPending && item.name === "Logout" ? (
              <Loader size={26} />
            ) : (
              item.icon
            )}
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
