import { cn } from "../../utils/cn";

const VARIANTS = {
  primary: "bg-primary text-white",
  leaf: "bg-leaf text-white",
  forest: "bg-forest text-white",
  soft: "bg-primary-soft text-primary",
  gray: "bg-gray-100 text-gray-600",
  red: "bg-red-100 text-red-600",
};

export const Badge = ({ color = "primary", className, children }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
      VARIANTS[color] ?? VARIANTS.primary,
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
