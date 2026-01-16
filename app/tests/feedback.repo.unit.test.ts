import { it, expect, vi, Mock } from "vitest";
import { query } from "../db/db.server";
import * as Repo from "../repositories/feedback.repo";
import { CreateFeedback } from "../types/Feedback";

vi.mock("../db/db.server", () => ({
  query: vi.fn(),
}));

it("calls query the correct amount of times when insertFeedback runs", async () => {
  const unique = `u-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const input: CreateFeedback = {
    title: `Unit test title ${unique}`,
    message: `Unit test message ${unique}`,
    category: "bug",
    email: `unit.test+${unique}@example.com`,
    priority: "low",
  };

  (query as Mock).mockResolvedValue([
    {
      id: "mock-id",
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const result = await Repo.createFeedback(input);

  expect(query).toHaveBeenCalledTimes(1);
});
