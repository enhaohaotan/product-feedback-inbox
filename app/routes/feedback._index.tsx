import { Link } from "@remix-run/react";

export default function FeedbackView() {
  return (
    <div className="flex flex-col gap-8 h-screen items-center justify-start my-8">
      <header className="flex items-center justify-center relative w-1/2">
        <h1 className="text-2xl font-bold">Product Feedback</h1>
        <Link
          to="/feedback/new"
          className="bg-black text-white px-2 rounded-sm text-xl hover:cursor-pointer hover:bg-gray-800 absolute right-0"
        >
          +
        </Link>
      </header>
      <main className="flex flex-col gap-4 w-1/2">
        <h2 className="text-lg font-bold">Feedback list</h2>
      </main>
    </div>
  );
}
