import { cn } from "../../utils/cn";

export const Input = ({ label, error, hint, id, name, className, ...props }) => {
  const inputId = id || name;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={inputId}
          name={name}
          className={cn(
            "peer h-14 w-full rounded-2xl border bg-white px-4 pb-1.5 pt-5 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
            error ? "border-red-300" : "border-gray-300",
            className
          )}
          {...props}
          placeholder=" "
        />
        {label ? (
          <label
            htmlFor={inputId}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200 peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
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

export default Input;
