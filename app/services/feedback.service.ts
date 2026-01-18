import * as feedbackRepo from "../repositories/feedback.repo";
import * as Repo from "../repositories/feedback.repo";
import {
  CreateFeedbackSchema,
  FeedbackFiltersSchema,
} from "../schemas/feedback.schema";
import { CreateFeedback, FeedbackFilters } from "../types/Feedback";

export async function createFeedback(rawFeedback: FormData) {
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
    const feedbackData = await Repo.createFeedback(
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

export async function createFeedbacks(rawFeedback: FormData) {
  const rawFeedbackData: Record<string, FormDataEntryValue> = {};
  rawFeedback.forEach((value, key) => {
    rawFeedbackData[key] = value;
  });
  const number = Number(rawFeedbackData["number"]);
  delete rawFeedbackData["number"];
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
    const feedbacks = Array.from({ length: number }, () => {
      const unique = `u-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const newData = Object.fromEntries(
        Object.entries(parsedCreateFeedbackData.data).map(([key, value]) => {
          if (key === "email" || key === "title" || key === "message") {
            return [key, `${unique}${value}`];
          }
          return [key, value];
        })
      );
      return newData;
    });

    console.log(feedbacks);

    const feedbackData = await Repo.createFeedbacks(
      feedbacks as CreateFeedback[]
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

export async function getFeedbacks(feedbackFiltersData: FeedbackFilters) {
  try {
    const feedbacks = await Repo.getFeedbacks(feedbackFiltersData);
    const totalCount = feedbacks.length > 0 ? feedbacks[0].total : 0;
    return {
      success: true,
      data: feedbacks,
      totalCount,
    };
  } catch (error) {
    throw error;
  }
}
