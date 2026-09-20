import { cn } from "../../utils/cn";

const COLORS = {
  primary: "bg-primary-soft text-primary",
  forest: "bg-forest/10 text-forest",
  leaf: "bg-leaf-soft text-leaf",
  amber: "bg-amber-100 text-amber-600",
  blue: "bg-blue-100 text-blue-600",
  red: "bg-red-100 text-red-600",
};

const StatCard = ({ icon: Icon, label, value, hint, color = "primary" }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-2 text-2xl font-extrabold text-forest">{value}</p>

        {hint ? (
          <p className="mt-1 text-xs text-gray-400">{hint}</p>
        ) : null}
      </div>

      {Icon ? (
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            COLORS[color] ?? COLORS.primary
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  </div>
);

export default StatCard;
