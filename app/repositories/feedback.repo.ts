import { CreateFeedback, Feedback } from "../types/Feedback";
import { query } from "../db/db.server";

export async function createFeedbackRepo(createFeedback: CreateFeedback) {
  try {
    const result = await query(
      `INSERT INTO feedbacks (title, message, category, email, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        createFeedback.title,
        createFeedback.message,
        createFeedback.category,
        createFeedback.email,
        createFeedback.priority,
      ]
    );

    return result[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw error;
  }
}
