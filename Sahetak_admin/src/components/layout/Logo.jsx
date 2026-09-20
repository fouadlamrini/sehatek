import { UtensilsCrossed } from "lucide-react";

const Logo = ({ compact = false }) => (
  <div className="flex items-center gap-2.5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
      <UtensilsCrossed className="h-5 w-5" />
    </div>

    {!compact ? (
      <div className="leading-tight">
        <p className="text-base font-extrabold tracking-tight text-white">
          Sehatek
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Admin Panel
        </p>
      </div>
    ) : null}
  </div>
);

export default Logo;
