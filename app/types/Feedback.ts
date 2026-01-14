import { z } from "zod";
import {
  CreateFeedbackSchema,
  FeedbackSchema,
} from "../schemas/feedback.schema";

export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>;

export type Feedback = z.infer<typeof FeedbackSchema>;

// export function toCreateFeedbackType(db: Feedback): CreateFeedback {
//   return {
//     title: db.title,
//     message: db.message,
//     category: db.category,
//     email: db.email,
//     priority: db.priority,
//   };
// }
