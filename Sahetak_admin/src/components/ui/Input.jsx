import { forwardRef } from "react";

import { cn } from "../../utils/cn";

const Input = forwardRef(
  ({ label, error, hint, id, name, className, containerClassName, ...props }, ref) => {
    const inputId = id || name;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          name={name}
          className={cn(
            "h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-50",
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
  }
);

Input.displayName = "Input";

export default Input;
