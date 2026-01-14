import { z } from "zod";
import {
  CreateFeedbackSchema,
  FeedbackSchema,
} from "../schemas/feedback.schema";

export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>;

export type Feedback = z.infer<typeof FeedbackSchema>;
