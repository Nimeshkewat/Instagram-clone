import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      {/* offsets: mobile top bar + bottom nav, desktop left rail */}
      <main className="pt-14 pb-14 md:pt-0 md:pb-0 md:pl-16 lg:pl-60">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
