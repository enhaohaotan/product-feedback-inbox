import { z } from "zod";

export const FormValuesSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(8, { message: "Title must be at most 8 characters" }),
  message: z
    .string()
    .min(20, { message: "Message must be at least 20 characters" })
    .max(2000, { message: "Message must be at most 2000 characters" }),
  category: z.enum(["bug", "feature", "billing", "other"]),
  email: z.email({ message: "Invalid email address" }),
  priority: z.enum(["low", "medium", "high"]),
});

export type FormValuesType = z.infer<typeof FormValuesSchema>;
