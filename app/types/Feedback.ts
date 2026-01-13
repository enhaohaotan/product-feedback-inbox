export type RawFeedbackType = {
  title: string | null;
  message: string | null;
  category: string | null;
  email: string | null;
  priority: string | null;
};

export type FeedbackDBType = {
  id: number;
  title: string;
  message: string;
  category: "bug" | "feature" | "billing" | "other";
  email: string;
  priority: "low" | "medium" | "high";
  created_at: Date;
  updated_at: Date;
};

export type FeedbackDomainType = {
  title: string;
  message: string;
  category: "bug" | "feature" | "billing" | "other";
  email: string;
  priority: "low" | "medium" | "high";
};

export function toFeedbackDomainType(db: FeedbackDBType): FeedbackDomainType {
  return {
    title: db.title,
    message: db.message,
    category: db.category,
    email: db.email,
    priority: db.priority,
  };
}
export function toRawFeedbackType(fd: FormData): RawFeedbackType {
  return {
    title: fd.get("title")?.toString() ?? null,
    message: fd.get("message")?.toString() ?? null,
    category: fd.get("category")?.toString() ?? null,
    email: fd.get("email")?.toString() ?? null,
    priority: fd.get("priority")?.toString() ?? null,
  };
}
