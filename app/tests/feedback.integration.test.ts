import { it, expect } from "vitest";
import { query } from "../db/db.server";
import * as Service from "../services/feedback.service";

it("can connect to postgres container", async () => {
  const result = await query("select 1 as ok");

  expect(result).toEqual([{ ok: 1 }]);
});

it("creates feedback correctly in DB", async () => {
  const unique = `it-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const fd = new FormData();
  fd.set("title", `Test title ${unique}`);
  fd.set("message", `Test message ${unique}`);
  fd.set("category", "bug");
  fd.set("email", `test+${unique}@example.com`);
  fd.set("priority", "low");

  const created = await Service.createFeedback(fd);
  expect(created.success).toBe(true);

  const rows = await query("select * from feedbacks where id = $1", [
    created.data.id,
  ]);

  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({
    title: `Test title ${unique}`,
    message: `Test message ${unique}`,
    category: "bug",
    email: `test+${unique}@example.com`,
    priority: "low",
  });
});
