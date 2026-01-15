import {
  Form,
  json,
  Link,
  redirect,
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

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const feedbacks = await getFeedbacksService(searchParams);

  if (!feedbacks.success) {
    if (feedbacks.error === "INVALID_FILTERS") {
      console.log("INVALID_FILTERS");
      throw redirect("/feedback");
    }
  }
  const { q, page, pagesize, category, priority } = feedbacks.filters;
  const totalCount = feedbacks.data.length > 0 ? feedbacks.data[0].total : 0;

  return json({
    items: feedbacks.data,
    totalCount,
    page,
    pagesize,
    q,
    category,
    priority,
  });
}

export default function FeedbackView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { items, totalCount, page, pagesize, q, category, priority } =
    useLoaderData<typeof loader>();

  const start = (page - 1) * pagesize + 1;
  const end = Math.min(page * pagesize, totalCount);

  const totalPages = Math.ceil(totalCount / pagesize);
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  function buildPageUrl(targetPage: number) {
    const params = new URLSearchParams();
    params.set("page", targetPage.toString());
    params.set("q", q);
    params.set("category", category);
    params.set("priority", priority);
    params.set("pagesize", pagesize.toString());
    return `/feedback?${params.toString()}`;
  }

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
            <Form method="get" className="flex gap-4">
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
                defaultValue={pagesize}
              />
              <Button type="submit">Apply</Button>
              <Button
                type="reset"
                onClick={() => {
                  const params = new URLSearchParams();
                  setSearchParams(params);
                }}
              >
                Clear
              </Button>
            </Form>
          </div>
        </div>
        {/* Results Summary */}
        <div>
          <p className="text-sm text-gray-500 mt-6">
            Showing {start}-{end} of {totalCount} results
          </p>
        </div>
        {/* Feedback List */}
        <div>
          {items.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {items.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback as Feedback}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center mt-20">
              <p className="text-gray-500">No feedbacks found</p>
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 my-6">
          <Link
            to={buildPageUrl(prevPage)}
            className={`text-sm underline ${
              page === 1
                ? "opacity-50 cursor-not-allowed "
                : "hover:cursor-pointer"
            }`}
          >
            Previous
          </Link>
          <p className="text-sm">
            Page {page} of {totalPages}
          </p>
          <Link
            to={buildPageUrl(nextPage)}
            className={`text-sm underline ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed "
                : "hover:cursor-pointer"
            }`}
          >
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}
