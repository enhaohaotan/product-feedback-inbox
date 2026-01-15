export default function SelectFieldFilter({
  name,
  label,
  options,
  defaultValue,
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
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
