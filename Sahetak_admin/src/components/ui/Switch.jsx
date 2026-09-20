import { cn } from "../../utils/cn";

const Switch = ({ checked, onChange, disabled, label, id }) => (
  <label
    htmlFor={id}
    className={cn(
      "inline-flex cursor-pointer items-center gap-2",
      disabled && "cursor-not-allowed opacity-60"
    )}
  >
    <span className="relative inline-flex">
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        disabled={disabled}
      />

      <span className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-leaf" />

      <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
    </span>

    {label ? <span className="text-sm text-gray-600">{label}</span> : null}
  </label>
);

export default Switch;
