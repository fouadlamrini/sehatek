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
  const hasValue =
    props.value !== undefined && props.value !== null && props.value !== "";

  return (
    <div className="w-full">
      <div className="relative">
        <select
          id={selectId}
          name={name}
          className={cn(
            "peer h-12 w-full cursor-pointer rounded-xl border bg-white px-4 pt-5 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-50",
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

        {label ? (
          <label
            htmlFor={selectId}
            className={cn(
              "pointer-events-none absolute right-4 top-3 text-xs transition-colors duration-200 peer-focus:text-primary",
              hasValue ? "text-gray-500" : "text-gray-400"
            )}
          >
            {label}
          </label>
        ) : null}
      </div>

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
};

export default Select;
