import { FeedbackDomainType, toFeedbackDomainType } from "../types/Feedback";
import { query } from "../utils/db.server";

export async function createFeedbackRepo(feedback: FeedbackDomainType) {
  try {
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
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw error;
  }
}
