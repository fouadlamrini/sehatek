import { Loader2 } from "lucide-react";

import { cn } from "../../utils/cn";

const SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
};

const Spinner = ({ size = "md", className }) => (
  <Loader2
    className={cn("animate-spin text-primary", SIZES[size] ?? SIZES.md, className)}
  />
);

export const FullPageLoader = ({ label = "Loading..." }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
    <Spinner size="lg" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default Spinner;
