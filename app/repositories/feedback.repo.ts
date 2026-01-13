import { query } from "../utils/db.server";
import { FormValuesType } from "../validators/form.schema";

export async function createFeedback(feedback: FormValuesType) {
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
  console.log(result);
  return result[0];
}
