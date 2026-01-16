import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_PRIORITIES,
} from "../constants/feedback.constants";
import ErrorMessage from "./ErrorMessage";

type Options = typeof FEEDBACK_CATEGORIES | typeof FEEDBACK_PRIORITIES;

export default function SelectField({
  name,
  label,
  errorMessage,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  errorMessage: string;
  defaultValue: string;
  options: Options;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm text-gray-500">
        {label}
      </label>
      <select
        name={name}
        id={name}
        className="border border-gray-300 rounded-sm px-2 py-1 text-sm"
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ErrorMessage message={errorMessage} />
    </div>
  );
}
