import { describe, expect, test } from "vitest";

process.env.DATABASE_URL ??= "postgresql://helpdesk:helpdesk@localhost:5432/helpdesk_db?schema=public";
process.env.AUTH_TOKEN_SECRET ??= "helpdesk-test-secret";

async function createTestApp() {
  const { buildApp } = await import("./app");
  const app = buildApp();
  await app.ready();
  return app;
}

describe("Helpdesk API security and validation", () => {
  test("GET /health includes security and rate limit headers", async () => {
    const app = await createTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-ratelimit-limit"]).toBeDefined();

    await app.close();
  });

  test("POST /api/users validates required fields before database access", async () => {
    const app = await createTestApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/users",
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ message: "name is required" });

    await app.close();
  });
});
