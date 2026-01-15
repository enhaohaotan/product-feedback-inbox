import { Feedback } from "../types/Feedback";

export default function FeedbackCard({
  key,
  feedback,
}: {
  key: string;
  feedback: Feedback;
}) {
  return (
    <div
      key={key}
      className="flex flex-col border border-gray-300 rounded-md py-2 px-4 w-80 justify-between"
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-bold truncate">{feedback.title}</h3>
        <div className="flex gap-2 items-center">
          <p className="text-xs text-gray-800 bg-gray-200 rounded-xl px-2 py-0.5">
            {feedback.category}
          </p>
          <p className="text-xs text-gray-800 bg-gray-200 rounded-xl px-2 py-0.5">
            {feedback.priority}
          </p>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mt-2">
          {feedback.message}
        </p>
      </div>
      <div className="flex flex-col mt-2">
        <p className="text-xs truncate">{feedback.email}</p>
        <p className="text-xs text-gray-500">
          {new Intl.DateTimeFormat("da-DK", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date(feedback.created_at))}
        </p>
      </div>
    </div>
  );
}
