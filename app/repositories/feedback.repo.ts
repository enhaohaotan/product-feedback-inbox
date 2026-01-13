import { FeedbackDomainType, toFeedbackDomainType } from "../types/Feedback";
import { query } from "../utils/db.server";

export async function createFeedbackRepo(feedback: FeedbackDomainType) {
  const result = await query(
    `INSERT INTO feedbacks (title, message, category, email, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      feedback.title,
      feedback.message,
      feedback.category,
      feedback.email,
      feedback.priority,
    ]
  );

  const feedbackDomain = toFeedbackDomainType(result[0]);
  return feedbackDomain;
}
