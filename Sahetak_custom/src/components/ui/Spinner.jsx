import { cn } from "../../utils/cn";

export const Spinner = ({ className }) => (
  <span
    className={cn(
      "inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary",
      className
    )}
    role="status"
    aria-label="Chargement"
  />
);

export default Spinner;
