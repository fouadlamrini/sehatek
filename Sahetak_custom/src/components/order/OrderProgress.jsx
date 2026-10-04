import { Check } from "lucide-react";

import { STEPS } from "../../constants";
import { cn } from "../../utils/cn";

const OrderProgress = ({ current, onNavigate }) => {
  const total = STEPS.length;

  return (
    <div>
      {/* Mobile */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span dir="rtl" className="font-bold text-forest">
            الخطوة {current + 1} من {total}
          </span>

          <span dir="rtl" className="font-semibold text-primary">
            {STEPS[current].label}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <ol className="flex items-start">
          {STEPS.map((step, index) => {
            const isDone = index < current;
            const isActive = index === current;
            const clickable = isDone && onNavigate;

            return (
              <li key={step.key} className="flex flex-1 items-start last:flex-none">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onNavigate(index)}
                  className={cn(
                    "flex flex-col items-center gap-2",
                    clickable ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition",
                      isDone && "border-leaf bg-leaf text-white",
                      isActive && "border-primary bg-primary text-white",
                      !isDone && !isActive && "border-gray-300 bg-white text-gray-400"
                    )}
                  >
                    {isDone || isActive ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      index + 1
                    )}
                  </span>

                  <span
                    dir="rtl"
                    className={cn(
                      "whitespace-nowrap text-sm font-semibold",
                      isActive ? "text-forest" : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </button>

                {index < total - 1 ? (
                  <span
                    className={cn(
                      "mx-3 mt-[18px] h-0.5 flex-1 rounded",
                      index < current ? "bg-leaf" : "bg-gray-200"
                    )}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>

        <p
          dir="rtl"
          className="mt-6 border-t border-gray-100 pt-4 text-xs font-extrabold uppercase tracking-[0.25em] text-primary"
        >
          الخطوة {current + 1} من {total}
        </p>
      </div>
    </div>
  );
};

export default OrderProgress;