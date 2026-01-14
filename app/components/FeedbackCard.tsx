import { Feedback } from "../types/Feedback";

export default function FeedbackCard({
  key,
  feedback,
}: {
  key: string;
  feedback: Feedback;
}) {
  return (
    <div key={key} className="border border-gray-300 rounded-md py-2 px-4 w-80">
      <h3 className="text-lg font-bold">{feedback.title}</h3>
      <p className="text-sm text-gray-500">{feedback.message}</p>
      <p className="text-sm text-gray-500">{feedback.email}</p>
      <p className="text-sm text-gray-500">{feedback.category}</p>
      <p className="text-sm text-gray-500">{feedback.priority}</p>
      <p className="text-sm text-gray-500">
        {feedback.created_at.toLocaleDateString()}
      </p>
    </div>
  );
}
