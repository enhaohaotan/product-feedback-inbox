import ErrorMessage from "./ErrorMessage";

export default function SelectField({
  name,
  label,
  errorMessage,
  defaultValue,
  options,
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
