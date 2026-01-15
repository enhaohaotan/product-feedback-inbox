export default function InputFieldFilter({
  type = "text",
  name,
  placeholder,
  defaultValue,
}) {
  return (
    <div className="flex gap-2 items-center ">
      <input
        type={type}
        name={name}
        id={name}
        className="border border-gray-300 rounded-sm px-2 py-1 text-sm w-full md:w-auto"
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}
