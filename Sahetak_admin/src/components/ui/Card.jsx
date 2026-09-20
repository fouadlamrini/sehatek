import { cn } from "../../utils/cn";

const Card = ({ className, children }) => (
  <div
    className={cn(
      "rounded-xl border border-gray-200 bg-white shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

export default Card;
