import * as feedbackRepo from "../repositories/feedback.repo";
import { RawFeedbackType } from "../types/Feedback";
import { FeedbackSchema, FeedbackType } from "../validators/feedback.schema";

export async function createFeedbackService(input: RawFeedbackType) {
  const parsed = FeedbackSchema.safeParse(input);
  if (!parsed.success) {
    const serverErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      serverErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, serverErrors, data: parsed.data };
  }
  const result = await feedbackRepo.createFeedbackRepo(parsed.data);
  return { success: true, data: result };
}
