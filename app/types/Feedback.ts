import { z } from "zod";
import {
  CreateFeedbackSchema,
  FeedbackFiltersSchema,
  FeedbackSchema,
} from "../schemas/feedback.schema";

export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>;

export type Feedback = z.infer<typeof FeedbackSchema>;

export type FeedbackFilters = z.infer<typeof FeedbackFiltersSchema>;
