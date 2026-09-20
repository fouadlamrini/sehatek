import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    className: "border-leaf/30 bg-leaf-soft text-forest",
    iconClass: "text-leaf",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-700",
    iconClass: "text-red-500",
  },
  info: {
    icon: Info,
    className: "border-primary/30 bg-primary-soft text-forest",
    iconClass: "text-primary",
  },
};

const ToastViewport = ({ toasts, onClose }) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const variant = VARIANTS[toast.type] ?? VARIANTS.info;
        const Icon = variant.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${variant.className}`}
            role="alert"
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${variant.iconClass}`} />

            <p className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => onClose(toast.id)}
              className="shrink-0 rounded-md p-0.5 opacity-60 transition hover:opacity-100"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastViewport;
