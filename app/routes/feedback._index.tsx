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
  FEEDBACK_CATEGORIES_OPTIONS,
  FEEDBACK_PRIORITIES_OPTIONS,
  PAGE_SIZE,
} from "../constants/feedback.constants";
import Button from "../components/Button";
import InputFieldFilter from "../components/InputFieldFilter";
import { useEffect, useState } from "react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import FeedbackCard from "../components/FeedbackCard";
import { Feedback, FeedbackFilters } from "../types/Feedback";
import * as Service from "../services/feedback.service";
import { FeedbackFiltersSchema } from "../schemas/feedback.schema";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const rawParams = Object.fromEntries(searchParams.entries());
  for (const [key, value] of Object.entries(rawParams)) {
    if (value === "") {
      delete rawParams[key];
    }
  }
  const parsedParams = FeedbackFiltersSchema.safeParse(rawParams);
  if (!parsedParams.success) {
    throw redirect("/feedback");
  }
  const feedbacks = await Service.getFeedbacks(parsedParams.data);
  if (!feedbacks.success) {
    throw redirect("/feedback");
  }
  const { q, page, pagesize, category, priority } = parsedParams.data;

  console.log(parsedParams.data);

  return json({
    items: feedbacks.data,
    totalCount: feedbacks.totalCount,
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

  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page, searchParams]);

  function buildPageUrl(targetPage: number) {
    const params = new URLSearchParams();
    params.set("page", targetPage.toString());
    params.set("q", q ?? "");
    params.set("category", category ?? "");
    params.set("priority", priority ?? "");
    params.set("pagesize", pagesize.toString());
    return `${params.toString()}`;
  }

  function commitPage(targetPage: number) {
    const params = buildPageUrl(targetPage);
    setSearchParams(params);
  }

  return (
    <div className="flex flex-col gap-8 h-screen items-center justify-start my-8 ">
      <header className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Product Feedback</h1>
      </header>
      <main className="flex flex-col gap-2 w-full lg:px-32 px-16 max-w-7xl">
        {/* Filter Bar */}
        <div className="flex flex-col gap-4 items-start w-full">
          <Button>
            <Link to="/feedback/new">New Feedback</Link>
          </Button>
          <div className="flex md:gap-4 md:items-center items-start flex-col md:flex-row w-full">
            <p className="text-sm text-gray-500 whitespace-nowrap">
              Filter by:
            </p>
            <Form
              method="get"
              className="flex flex-col md:flex-row md:gap-4 gap-1 w-full"
            >
              <input type="hidden" name="page" value="1" />
              <InputFieldFilter
                name="q"
                placeholder="Search"
                defaultValue={q}
              />
              <SelectFieldFilter
                name="category"
                label="Category"
                options={FEEDBACK_CATEGORIES_OPTIONS}
                defaultValue={category ?? "all"}
              />
              <SelectFieldFilter
                name="priority"
                label="Priority"
                options={FEEDBACK_PRIORITIES_OPTIONS}
                defaultValue={priority ?? "all"}
              />
              <SelectFieldFilter
                name="pagesize"
                label="Page Size"
                options={PAGE_SIZE}
                defaultValue={pagesize.toString()}
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
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
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
            to={`/feedback?${buildPageUrl(prevPage)}`}
            className={`text-sm underline ${
              page === 1
                ? "opacity-50 cursor-not-allowed "
                : "hover:cursor-pointer"
            }`}
          >
            Previous
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span>Page</span>
            <input
              type="text"
              name="page"
              value={currentPage}
              className="border border-gray-300 rounded-sm px-1 py-1 text-center w-8"
              onChange={(e) => {
                const value = e.target.value;
                if (!/^\d*$/.test(value) || Number(value) < 1) {
                  setCurrentPage(1);
                } else if (Number(value) > totalPages) {
                  setCurrentPage(totalPages);
                } else {
                  setCurrentPage(Number(value));
                }
              }}
              onBlur={() => {
                commitPage(currentPage);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitPage(currentPage);
                }
              }}
            />
            <span>of {totalPages}</span>
          </div>
          <Link
            to={`/feedback?${buildPageUrl(nextPage)}`}
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
