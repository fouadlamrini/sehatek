import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
