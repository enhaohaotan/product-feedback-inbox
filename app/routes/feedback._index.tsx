import {
  Form,
  json,
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
import SelectFieldFilter from "../components/SelectFieldFilter";
import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_PRIORITIES,
  PAGESIZE,
} from "../constants/feedback.constants";
import Button from "../components/Button";
import InputFieldFilter from "../components/InputFieldFilter";
import { useEffect, useState } from "react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import FeedbackCard from "../components/FeedbackCard";
import { Feedback } from "../types/Feedback";
import { getFeedbacksService } from "../services/feedback.service";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const message = formData.get("message");
  const email = formData.get("email");
  const category = formData.get("category");
  const priority = formData.get("priority");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = searchParams.get("pagesize") ?? "10";
  const category = searchParams.get("category") ?? "all";
  const priority = searchParams.get("priority") ?? "all";

  const feedbacks = await getFeedbacksService({
    q,
    page,
    pageSize,
    category,
    priority,
  });

  if (!feedbacks.success) {
    throw new Error(feedbacks.errors.join(", "));
  }

  const total = feedbacks.data[0].total;
  const start = (page - 1) * Number(pageSize) + 1;
  const end = Math.min(page * Number(pageSize), total);

  return json({
    feedbacks: feedbacks.data,
    total,
    start,
    end,
    q,
    page,
    pageSize,
    category,
    priority,
  });
}

export default function FeedbackView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date("2024-01-01T00:00:00.000Z");

  const {
    feedbacks,
    total,
    start,
    end,
    q,
    page,
    pageSize,
    category,
    priority,
  } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-8 h-screen items-center justify-start my-8 ">
      <header className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Product Feedback</h1>
      </header>
      <main className="flex flex-col gap-2">
        {/* Filter Bar */}
        <div className="flex flex-col gap-4 items-start">
          <Button asChild>
            <Link to="/feedback/new">New Feedback</Link>
          </Button>
          <div className="flex gap-4 items-center">
            <p className="text-sm text-gray-500 whitespace-nowrap">
              Filter by:
            </p>
            <Form key={location.search} method="get" className="flex gap-4">
              <input type="hidden" name="page" value="1" />
              <InputFieldFilter
                name="q"
                placeholder="Search"
                defaultValue={q}
              />
              <SelectFieldFilter
                name="category"
                label="Category"
                options={["all", ...FEEDBACK_CATEGORIES]}
                defaultValue={category}
              />
              <SelectFieldFilter
                name="priority"
                label="Priority"
                options={["all", ...FEEDBACK_PRIORITIES]}
                defaultValue={priority}
              />
              <SelectFieldFilter
                name="pagesize"
                label="Page Size"
                options={PAGESIZE}
                defaultValue={pageSize}
              />
              <Button type="submit">Apply</Button>
              <Button asChild>
                <Link to="/feedback">Clear</Link>
              </Button>
            </Form>
          </div>
        </div>
        {/* Results Summary */}
        <div>
          <p className="text-sm text-gray-500 mt-6">
            Showing {start}-{end} of {total} results
          </p>
        </div>
        {/* Feedback List */}
        <div>
          {feedbacks.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {feedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback as Feedback}
                />
              ))}
            </div>
          ) : (
            <p>No feedbacks found</p>
          )}
        </div>
      </main>
    </div>
  );
}
