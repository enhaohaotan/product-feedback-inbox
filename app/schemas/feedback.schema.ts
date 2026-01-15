import { z } from "zod";
import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_CATEGORIES_OPTIONS,
  FEEDBACK_PRIORITIES,
  FEEDBACK_PRIORITIES_OPTIONS,
  PAGE_SIZE,
} from "../constants/feedback.constants";

export const CreateFeedbackSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(80, { message: "Title must be at most 80 characters" }),
  message: z
    .string()
    .min(20, { message: "Message must be at least 20 characters" })
    .max(2000, { message: "Message must be at most 2000 characters" }),
  category: z.enum(FEEDBACK_CATEGORIES),
  email: z.email({ message: "Invalid email address" }),
  priority: z.enum(FEEDBACK_PRIORITIES),
});

export const FeedbackSchema = CreateFeedbackSchema.extend({
  id: z.uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const FeedbackFiltersSchema = z
  .object({
    q: z.string().default(""),
    page: z.coerce.number().int().min(1).default(1),
    pagesize: z.coerce
      .number()
      .int()
      .min(1)
      .refine((val) => PAGE_SIZE.includes(val as (typeof PAGE_SIZE)[number]))
      .default(10),
    category: z
      .enum(FEEDBACK_CATEGORIES_OPTIONS)
      .default(null)
      .transform((val) => (val === "all" ? null : val)),
    priority: z
      .enum(FEEDBACK_PRIORITIES_OPTIONS)
      .default(null)
      .transform((val) => (val === "all" ? null : val)),
  })
  .strict();
