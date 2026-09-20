import { forwardRef } from "react";

import { cn } from "../../utils/cn";

const Textarea = forwardRef(
  ({ label, error, id, name, className, rows = 3, ...props }, ref) => {
    const textareaId = id || name;

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          className={cn(
            "w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20",
            error ? "border-red-300" : "border-gray-300",
            className
          )}
          {...props}
        />

        {error ? (
          <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
