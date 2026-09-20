import { useEffect } from "react";

import { SidebarContent } from "./Sidebar";
import { cn } from "../../utils/cn";

const MobileSidebar = ({ open, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "absolute inset-y-0 left-0 w-64 max-w-[80%] shadow-2xl transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
};

export default MobileSidebar;
