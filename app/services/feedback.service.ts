import * as feedbackRepo from "../repositories/feedback.repo";
import { CreateFeedbackSchema } from "../schemas/feedback.schema";

export async function createFeedbackService(rawFeedback: FormData) {
  const rawFeedbackData: Record<string, FormDataEntryValue> = {};
  rawFeedback.forEach((value, key) => {
    rawFeedbackData[key] = value;
  });
  const parsedCreateFeedbackData =
    CreateFeedbackSchema.safeParse(rawFeedbackData);

  if (!parsedCreateFeedbackData.success) {
    const serverErrors: Record<string, string> = {};
    for (const issue of parsedCreateFeedbackData.error.issues) {
      serverErrors[String(issue.path[0])] = issue.message;
    }
    return {
      success: false,
      serverErrors,
      data: parsedCreateFeedbackData.data,
    };
  }

  try {
    const feedbackData = await feedbackRepo.createFeedbackRepo(
      parsedCreateFeedbackData.data
    );
    return { success: true, data: feedbackData };
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return {
        success: false,
        serverErrors: { email: "Email already exists" },
        data: parsedCreateFeedbackData.data,
      };
    }
    throw error;
  }
}
