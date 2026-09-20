import { cn } from "../../utils/cn";

const VARIANTS = {
  gray: "bg-gray-100 text-gray-700",
  primary: "bg-primary-soft text-primary",
  leaf: "bg-leaf-soft text-leaf",
  forest: "bg-forest/10 text-forest",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  violet: "bg-violet-100 text-violet-700",
  red: "bg-red-100 text-red-700",
};

const Badge = ({ color = "gray", className, children }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
      VARIANTS[color] ?? VARIANTS.gray,
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
