import { MEAL_DAYS } from "../../constants";
import { cn } from "../../utils/cn";

// Days already stored on older products may not be part of the standard list;
// keep them selectable so editing never silently drops data.
const MealDaysSelector = ({ value = [], onChange, error }) => {
  const options = [
    ...MEAL_DAYS,
    ...value.filter((day) => !MEAL_DAYS.includes(day)),
  ];

  const toggle = (day) => {
    if (value.includes(day)) {
      onChange(value.filter((item) => item !== day));
    } else {
      onChange([...value, day]);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        Meal days
      </span>

      <div className="flex flex-wrap gap-2">
        {options.map((day) => {
          const active = value.includes(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => toggle(day)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
};

export default MealDaysSelector;
