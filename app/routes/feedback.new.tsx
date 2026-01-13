import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { FormValuesSchema, FormValuesType } from "../validators/form.schema";
import { useEffect, useState } from "react";
import { toFormValues } from "../types/Form";
import { createFeedback } from "../repositories/feedback.repo";

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const values = toFormValues(fd);

  // validate all fields plus unique email
  const result = FormValuesSchema.safeParse(values);
  if (!result.success) {
    const serverErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      for (const issue of result.error.issues) {
        serverErrors[String(issue.path[0])] = issue.message;
      }
      return json({ serverErrors, values }, { status: 400 });
    }
  }
  const input: FormValuesType = result.data;
  // TODO: chech if single email
  // TODO: Save to database
  await createFeedback(input);
  return redirect("/feedback");
}

export default function NewFeedback() {
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting";
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const serverErrors = actionData?.serverErrors ?? {};
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (Object.keys(clientErrors).length > 0) {
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
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
    const result = FormValuesSchema.safeParse(values);
    if (result.success) {
      setClientErrors({});
      return true;
    }
    for (const issue of result.error.issues) {
      setClientErrors((prev) => ({ ...prev, [issue.path[0]]: issue.message }));
    }
    return false;
  }

  function validateField(name: keyof FormValuesType, value: string) {
    const fieldSchema = FormValuesSchema.shape[name];
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

  function getError(name: string) {
    return (
      <p className="text-red-500 text-xs">
        {serverErrors[name] ?? clientErrors[name]}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="text-2xl font-bold my-8">New Feedback</h1>
      <Form
        method="post"
        replace
        className="flex flex-col gap-4 w-1/2"
        onSubmit={(e) => {
          const formData = e.currentTarget;
          const ok = validateAllFields(formData);
          if (!ok) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm text-gray-500">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="border border-gray-300 rounded-sm px-2 py-1 text-sm"
            defaultValue={actionData?.values?.title ?? ""}
            onBlur={(e) => validateField("title", e.currentTarget.value)}
          />
          {getError("title")}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="text-sm text-gray-500">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            className="border border-gray-300 rounded-sm px-2 py-1 text-sm"
            defaultValue={actionData?.values.message ?? ""}
            onBlur={(e) => validateField("message", e.currentTarget.value)}
          />
          {getError("message")}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm text-gray-500">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="border border-gray-300 rounded-sm px-2 py-1 text-sm"
            defaultValue={actionData?.values?.category ?? ""}
          >
            <option value="bug">bug</option>
            <option value="feature">feature</option>
            <option value="billing">billing</option>
            <option value="other">other</option>
          </select>
          {getError("category")}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-500">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="border border-gray-300 rounded-sm px-2 py-1 text-sm"
            defaultValue={actionData?.values?.email ?? ""}
            onBlur={(e) => validateField("email", e.currentTarget.value)}
          />
          {getError("email")}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className="text-sm text-gray-500">
            Priority
          </label>
          <select
            name="priority"
            id="priority"
            className="border border-gray-300 rounded-sm px-2 py-1 text-sm"
            defaultValue={actionData?.values?.priority ?? ""}
            onBlur={(e) => validateField("priority", e.currentTarget.value)}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          {getError("priority")}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-black text-white px-4 py-2 rounded-sm my-4
          ${
            !canSubmit
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
