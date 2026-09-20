import { cn } from "../../utils/cn";

export const QuantityStepper = ({ value, onChange, min = 1, max = 20, disabled }) => {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || value <= min}
        aria-label="Diminuer la quantité"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg bg-white text-lg font-bold text-gray-700 shadow-sm transition hover:bg-gray-200",
          (disabled || value <= min) && "cursor-not-allowed opacity-40"
        )}
      >
        −
      </button>

      <span className="w-10 text-center text-sm font-bold text-gray-800">
        {value}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={disabled || value >= max}
        aria-label="Augmenter la quantité"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg bg-white text-lg font-bold text-gray-700 shadow-sm transition hover:bg-gray-200",
          (disabled || value >= max) && "cursor-not-allowed opacity-40"
        )}
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepper;
