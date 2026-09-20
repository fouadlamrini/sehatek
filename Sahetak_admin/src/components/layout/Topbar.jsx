import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, UserCircle } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { ROLE_LABELS } from "../../constants";
import { getInitials } from "../../utils/format";

const PAGE_TITLES = [
  { match: "/dashboard", title: "Dashboard" },
  { match: "/products", title: "Products" },
  { match: "/promotions", title: "Promotions" },
  { match: "/packs", title: "Packs" },
  { match: "/orders", title: "Orders" },
  { match: "/admins/create", title: "Create Admin" },
  { match: "/admins", title: "Admins" },
  { match: "/profile", title: "Profile" },
];

const getPageTitle = (pathname) =>
  PAGE_TITLES.find((item) => pathname.startsWith(item.match))?.title ??
  "Dashboard";

const Topbar = ({ onMenuClick }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-base font-bold text-forest sm:text-lg">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex items-center gap-2 rounded-lg p-1 pr-2 transition hover:bg-gray-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
            {getInitials(admin?.name)}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {admin?.name}
            </p>
            <p className="text-xs text-gray-400">
              {ROLE_LABELS[admin?.role] ?? admin?.role}
            </p>
          </div>

          <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
        </button>

        {menuOpen ? (
          <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <UserCircle className="h-4 w-4" />
              Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Topbar;
