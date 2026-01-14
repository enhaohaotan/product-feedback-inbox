import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
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
  const search = searchParams.get("q") ?? "";
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pagesize") ?? "10";
  const category = searchParams.get("category") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const total = 100;
  const start = (Number(page) - 1) * Number(pageSize) + 1;
  const end = Math.min(Number(page) * Number(pageSize), total);

  return { search, page, pageSize, category, priority, total, start, end };
}

export default function FeedbackView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date("2024-01-01T00:00:00.000Z");

  const { search, page, pageSize, category, priority, total, start, end } =
    useLoaderData<typeof loader>();
  const emptyFeedback = [];
  const feedbacks = [
    {
      id: "1",
      title: "Feedback 1",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      email: "test@test.com",
      category: "Feature",
      priority: "Low",
      created_at: now,
      updated_at: now,
    },
    {
      id: "2",
      title: "Feedback 2",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      email: "test@test.com",
      category: "Feature",
      priority: "Low",
      created_at: now,
      updated_at: now,
    },
    {
      id: "3",
      title: "Feedback 3",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      email: "test@test.com",
      category: "Feature",
      priority: "Low",
      created_at: now,
      updated_at: now,
    },
  ];

  return (
    <div className="flex flex-col gap-8 h-screen items-center justify-start my-8 ">
      <header className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Product Feedback</h1>
      </header>
      <main className="flex flex-col gap-4">
        {/* Filter Bar */}
        <div className="flex flex-col gap-4 items-start">
          <Button asChild>
            <Link to="/feedback/new">New Feedback</Link>
          </Button>
          <div className="flex gap-4 items-center">
            <p className="text-sm text-gray-500 whitespace-nowrap">
              Filter by:
            </p>
            <Form method="get" className="flex gap-4">
              <input type="hidden" name="page" value="1" />
              <InputFieldFilter name="q" placeholder="Search" />
              <SelectFieldFilter
                name="category"
                label="Category"
                options={FEEDBACK_CATEGORIES}
              />
              <SelectFieldFilter
                name="priority"
                label="Priority"
                options={FEEDBACK_PRIORITIES}
              />
              <SelectFieldFilter
                name="pagesize"
                label="Page Size"
                options={PAGESIZE}
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
          <p className="text-sm text-gray-500">
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
