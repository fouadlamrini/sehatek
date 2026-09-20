import { cn } from "../../utils/cn";

export const Input = ({
  label,
  error,
  hint,
  id,
  name,
  className,
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        name={name}
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20",
          error ? "border-red-300" : "border-gray-300",
          className
        )}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
};

export default Input;
