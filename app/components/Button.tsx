export default function Button({ children, ...props }) {
  return (
    <button
      className="w-full md:w-auto bg-black text-white px-4 py-1 rounded-sm text-sm hover:cursor-pointer hover:opacity-80 flex items-center justify-center"
      {...props}
    >
      {children}
    </button>
  );
}
