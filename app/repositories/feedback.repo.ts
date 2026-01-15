import { CreateFeedback, FeedbackFilters } from "../types/Feedback";
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

export async function getFeedbacksRepo({
  q,
  page,
  pagesize,
  category,
  priority,
}: FeedbackFilters) {
  try {
    const whereClause = [];
    const values = [];

    if (q) {
      values.push(`%${q}%`);
      whereClause.push(
        `title ILIKE $${values.length} OR message ILIKE $${values.length}`
      );
    }
    if (category !== "all") {
      values.push(category);
      whereClause.push(`category = $${values.length}`);
    }
    if (priority !== "all") {
      values.push(priority);
      whereClause.push(`priority = $${values.length}`);
    }

    const limit = pagesize;
    const pageNum = Number(page);
    const offset = (Math.max(pageNum, 1) - 1) * limit;

    values.push(limit);
    const limitPlaceHolder = `$${values.length}`;
    values.push(offset);
    const offsetPlaceHolder = `$${values.length}`;

    const whereClauseString =
      whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

    const result = await query(
      `SELECT 
        *,
        COUNT(*) OVER() AS total
       FROM feedbacks 
       ${whereClauseString} 
       ORDER BY created_at DESC 
       LIMIT ${limitPlaceHolder} 
       OFFSET ${offsetPlaceHolder}`,
      values
    );
    return result;
  } catch (error) {
    throw error;
  }
}
