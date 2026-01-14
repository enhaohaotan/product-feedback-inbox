import ErrorMessage from "./ErrorMessage";

export default function TextareaField({
  name,
  label,
  errorMessage,
  defaultValue,
  validateField,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm text-gray-500">
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        className="border border-gray-300 rounded-sm px-2 py-1 text-sm"
        defaultValue={defaultValue}
        onBlur={(e) => validateField(name, e.currentTarget.value)}
      />
      <ErrorMessage message={errorMessage} />
    </div>
  );
}
