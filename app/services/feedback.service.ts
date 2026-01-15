import * as feedbackRepo from "../repositories/feedback.repo";
import { getFeedbacksRepo } from "../repositories/feedback.repo";
import {
  CreateFeedbackSchema,
  FeedbackFiltersSchema,
} from "../schemas/feedback.schema";
import { FeedbackFilters } from "../types/Feedback";

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

export async function getFeedbacksService(searchParams: URLSearchParams) {
  try {
    const rawParams = Object.fromEntries(searchParams.entries());

    {
      /* If no params are provided, return to /feedback */
    }
    if (Object.keys(rawParams).length === 0) {
      const feedbackFiltersData: FeedbackFilters = {
        q: "",
        page: 1,
        pagesize: 10,
        category: "all",
        priority: "all",
      };
      const feedbacks = await getFeedbacksRepo(feedbackFiltersData);
      return {
        success: true,
        data: feedbacks,
        filters: feedbackFiltersData,
      };
    }

    const parsedFeedbackFilters = FeedbackFiltersSchema.safeParse(rawParams);
    if (!parsedFeedbackFilters.success) {
      return {
        success: false,
        error: "INVALID_FILTERS",
      };
    }

    const feedbacks = await getFeedbacksRepo(parsedFeedbackFilters.data);
    return {
      success: true,
      data: feedbacks,
      filters: parsedFeedbackFilters.data,
    };
  } catch (error) {
    throw error;
  }
}
