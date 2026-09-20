import { cn } from "../../utils/cn";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
  leaf: "bg-leaf text-white hover:bg-leaf/90 shadow-sm",
  forest: "bg-forest text-white hover:bg-forest/90 shadow-sm",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-6 text-base gap-2",
  icon: "h-9 w-9",
};

export const Button = ({
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
      "inline-flex select-none items-center justify-center rounded-xl font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
      VARIANTS[variant] ?? VARIANTS.primary,
      SIZES[size] ?? SIZES.md,
      className
    )}
    {...props}
  >
    {loading ? (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    ) : Icon ? (
      <Icon className="h-4 w-4" />
    ) : null}

    {children}
  </button>
);

export default Button;
