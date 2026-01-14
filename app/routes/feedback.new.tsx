import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { CreateFeedbackSchema } from "../schemas/feedback.schema";
import { CreateFeedback } from "../types/Feedback";
import { useEffect, useState } from "react";
import { createFeedbackService } from "../services/feedback.service";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import TextareaField from "../components/TextareaField";
import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_PRIORITIES,
} from "../constants/feedback.constants";

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const result = await createFeedbackService(fd);
  if (!result.success) {
    return json(
      { serverErrors: result.serverErrors, data: result.data },
      { status: 400 }
    );
  }
  return redirect("/feedback");
}

export default function NewFeedback() {
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting";
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const serverErrors = actionData?.serverErrors ?? {};
  const [hasClientErrors, setHasClientErrors] = useState(false);

  useEffect(() => {
    if (Object.keys(clientErrors).length > 0) {
      setHasClientErrors(true);
    } else {
      setHasClientErrors(false);
    }
  }, [clientErrors]);

  function validateAllFields(form: HTMLFormElement) {
    const fd = new FormData(form);
    const values = {
      title: String(fd.get("title") ?? ""),
      message: String(fd.get("message") ?? ""),
      category: String(fd.get("category") ?? ""),
      email: String(fd.get("email") ?? ""),
      priority: String(fd.get("priority") ?? ""),
    };
    const result = CreateFeedbackSchema.safeParse(values);
    if (result.success) {
      setClientErrors({});
    }
    for (const issue of result.error.issues) {
      setClientErrors((prev) => ({ ...prev, [issue.path[0]]: issue.message }));
    }
    return false;
  }

  function validateField(name: keyof CreateFeedback, value: string) {
    const fieldSchema = CreateFeedbackSchema.shape[name];
    const result = fieldSchema.safeParse(value);

    setClientErrors((prev) => {
      const next = { ...prev };
      if (result.success) {
        delete next[name];
      } else {
        next[name] = result.error.issues[0]?.message ?? "Invalid field";
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col items-center h-screen justify-start my-8">
      <h1 className="text-2xl font-bold my-8">New Feedback</h1>
      <Form
        method="post"
        className="flex flex-col gap-4 w-1/2"
        onSubmit={(e) => {
          const formData = e.currentTarget;
          const ok = validateAllFields(formData);
          if (!ok) {
            e.preventDefault();
            throw new Error("Cannot submit form");
          }
        }}
      >
        <InputField
          type="text"
          name="title"
          label="Title"
          validateField={validateField}
          errorMessage={clientErrors["title"] ?? serverErrors["title"]}
          defaultValue={actionData?.data?.title ?? ""}
        />
        <TextareaField
          name="message"
          label="Message"
          validateField={validateField}
          errorMessage={clientErrors["message"] ?? serverErrors["message"]}
          defaultValue={actionData?.data?.message ?? ""}
        />
        <SelectField
          name="category"
          label="Category"
          errorMessage={clientErrors["category"] ?? serverErrors["category"]}
          defaultValue={actionData?.data?.category ?? ""}
          options={FEEDBACK_CATEGORIES}
        />
        <InputField
          type="email"
          name="email"
          label="Email"
          validateField={validateField}
          errorMessage={clientErrors["email"] ?? serverErrors["email"]}
          defaultValue={actionData?.data?.email ?? ""}
        />
        <SelectField
          name="priority"
          label="Priority"
          errorMessage={clientErrors["priority"] ?? serverErrors["priority"]}
          defaultValue={actionData?.data?.priority ?? ""}
          options={FEEDBACK_PRIORITIES}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-black text-white px-4 py-2 rounded-sm my-4
          ${
            hasClientErrors
              ? "opacity-50 cursor-not-allowed"
              : "hover:cursor-pointer"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </Form>
    </div>
  );
}
