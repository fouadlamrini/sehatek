import { cn } from "../../utils/cn";

export const Select = ({
  label,
  error,
  hint,
  id,
  name,
  options = [],
  placeholder,
  children,
  className,
  ...props
}) => {
  const selectId = id || name;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        name={name}
        className={cn(
          "h-12 w-full cursor-pointer rounded-xl border bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-50",
          error ? "border-red-300" : "border-gray-300",
          className
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}

        {children}
      </select>

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
};

export default Select;
