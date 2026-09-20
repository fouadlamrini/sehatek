import { Loader2 } from "lucide-react";

import { cn } from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/40",
  secondary:
    "bg-forest text-white hover:bg-forest/90 focus-visible:ring-forest/40",
  success: "bg-leaf text-white hover:bg-leaf/90 focus-visible:ring-leaf/40",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-300",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-200",
};

const SIZES = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-11 gap-2 px-6 text-sm",
  icon: "h-9 w-9",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className,
  children,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={cn(
      "inline-flex select-none items-center justify-center rounded-lg font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60",
      VARIANTS[variant] ?? VARIANTS.primary,
      SIZES[size] ?? SIZES.md,
      className
    )}
    {...props}
  >
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : Icon ? (
      <Icon className="h-4 w-4" />
    ) : null}

    {children}
  </button>
);

export default Button;
