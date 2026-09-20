import { Check } from "lucide-react";

import { STEPS } from "../../constants";
import { cn } from "../../utils/cn";

const OrderProgress = ({ current, onNavigate }) => {
  const total = STEPS.length;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-5">
      {/* Mobile */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold text-forest">
            Étape {current + 1} sur {total}
          </span>
          <span className="font-semibold text-primary">
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
      <ol className="hidden items-center sm:flex">
        {STEPS.map((step, index) => {
          const isDone = index < current;
          const isActive = index === current;
          const clickable = isDone && onNavigate;

          return (
            <li key={step.key} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onNavigate(index)}
                className={cn(
                  "flex items-center gap-2",
                  clickable ? "cursor-pointer" : "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition",
                    isDone && "border-leaf bg-leaf text-white",
                    isActive && "border-primary bg-primary text-white",
                    !isDone && !isActive && "border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : index + 1}
                </span>

                <span
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
                    "mx-3 h-0.5 flex-1 rounded",
                    index < current ? "bg-leaf" : "bg-gray-200"
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default OrderProgress;
