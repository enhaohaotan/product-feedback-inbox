export type RawFormValues = {
  title: string | null;
  message: string | null;
  category: string | null;
  email: string | null;
  priority: string | null;
};

export function toFormValues(fd: FormData): RawFormValues {
  return {
    title: fd.get("title")?.toString() ?? null,
    message: fd.get("message")?.toString() ?? null,
    category: fd.get("category")?.toString() ?? null,
    email: fd.get("email")?.toString() ?? null,
    priority: fd.get("priority")?.toString() ?? null,
  };
}
