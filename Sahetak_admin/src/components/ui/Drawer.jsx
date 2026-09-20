import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "../../utils/cn";

const SIZES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-xl",
};

const Drawer = ({ open, onClose, title, description, children, footer, size = "md" }) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 flex h-full w-full flex-col bg-white shadow-2xl",
          SIZES[size] ?? SIZES.md
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            {title ? (
              <h2 className="text-lg font-bold text-forest">{title}</h2>
            ) : null}

            {description ? (
              <p className="mt-0.5 text-sm text-gray-500">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </aside>
    </div>,
    document.body
  );
};

export default Drawer;
