import { it, expect, vi, Mock } from "vitest";
import * as Service from "../services/feedback.service";
import * as Repo from "../repositories/feedback.repo";

vi.mock("../repositories/feedback.repo", () => ({
  createFeedback: vi.fn(),
}));

it("does call Repo.createFeedback when trying to create a feedback with the service", async () => {
  const unique = `u-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const fd = new FormData();
  fd.set("title", `Test title ${unique}`);
  fd.set("message", `Test message ${unique}`);
  fd.set("category", "bug");
  fd.set("email", `test+${unique}@example.com`);
  fd.set("priority", "low");

  (Repo.createFeedback as Mock).mockResolvedValue({
    id: "mock-id",
    title: `Test title ${unique}`,
    message: `Test message ${unique}`,
    category: "bug",
    email: `test+${unique}@example.com`,
    priority: "low",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const result = await Service.createFeedback(fd);
  expect(result.success).toBe(true);
  expect(Repo.createFeedback).toHaveBeenCalledTimes(1);
  expect(Repo.createFeedback).toHaveBeenCalledWith({
    title: `Test title ${unique}`,
    message: `Test message ${unique}`,
    category: "bug",
    email: `test+${unique}@example.com`,
    priority: "low",
  });
});
