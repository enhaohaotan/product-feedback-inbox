import {
  FEEDBACK_CATEGORIES_OPTIONS,
  FEEDBACK_PRIORITIES_OPTIONS,
  PAGE_SIZE,
} from "../constants/feedback.constants";

type Options =
  | typeof FEEDBACK_CATEGORIES_OPTIONS
  | typeof FEEDBACK_PRIORITIES_OPTIONS
  | typeof PAGE_SIZE;

export default function SelectFieldFilter({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: Options;
  defaultValue: string;
}) {
  return (
    <div className="flex gap-2 items-center">
      <label htmlFor={name} className="text-sm whitespace-nowrap">
        {label}
      </label>
      <select
        name={name}
        id={name}
        className="border border-gray-300 rounded-sm px-2 py-1 text-sm w-full md:w-auto"
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option key={option + name} value={option === "all" ? "" : option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
