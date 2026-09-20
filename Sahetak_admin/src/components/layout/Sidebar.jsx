import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";

import { NAV_ITEMS } from "./navigation";
import Logo from "./Logo";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_LABELS } from "../../constants";
import { getInitials } from "../../utils/format";
import { cn } from "../../utils/cn";

const linkClasses = ({ isActive }) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-primary text-white shadow-sm"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  );

const NavGroup = ({ item, onNavigate }) => {
  const location = useLocation();

  const isChildActive = item.children.some((child) =>
    location.pathname.startsWith(child.to)
  );

  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  const Icon = item.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
          isChildActive
            ? "text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />

        <span className="flex-1 text-left">{item.label}</span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div className="mt-1 space-y-1 border-l border-white/15 pl-4 ml-5">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg px-3 py-1.5 text-sm transition",
                  isActive
                    ? "bg-white/15 font-semibold text-primary"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const SidebarContent = ({ onNavigate }) => {
  const { admin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const items = NAV_ITEMS.filter(
    (item) => !item.superAdminOnly || isSuperAdmin
  );

  return (
    <div className="flex h-full flex-col bg-forest">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) =>
          item.type === "group" ? (
            <NavGroup key={item.label} item={item} onNavigate={onNavigate} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onNavigate}
              className={linkClasses}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {getInitials(admin?.name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {admin?.name}
            </p>
            <p className="truncate text-xs text-white/50">
              {ROLE_LABELS[admin?.role] ?? admin?.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => (
  <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
    <SidebarContent />
  </aside>
);

export default Sidebar;
