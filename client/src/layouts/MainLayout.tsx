import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <Sidebar />
      <main className="mx-auto max-w-[1600px] pt-14 pb-20 md:pt-6 md:pb-8 md:pl-16 lg:pl-60">
        <div className="mx-auto w-full max-w-6xl px-2 sm:px-4 md:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
