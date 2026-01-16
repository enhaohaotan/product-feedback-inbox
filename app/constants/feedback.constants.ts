// constants.ts
export const FEEDBACK_CATEGORIES = [
  "bug",
  "feature",
  "billing",
  "other",
] as const;
export const FEEDBACK_CATEGORIES_OPTIONS = ["all", ...FEEDBACK_CATEGORIES];
export const FEEDBACK_PRIORITIES = ["low", "medium", "high"] as const;
export const FEEDBACK_PRIORITIES_OPTIONS = ["all", ...FEEDBACK_PRIORITIES];
export const PAGE_SIZE = [10, 25, 50] as const;
