import { describe, expect, test } from "vitest";
import { deleteCachedByPrefix, getCached, setCached } from "./cache";

describe("in-memory cache", () => {
  test("stores and reads values by key", () => {
    setCached("lab5:test:one", { source: "database" });

    expect(getCached<{ source: string }>("lab5:test:one")).toEqual({
      source: "database",
    });

    deleteCachedByPrefix("lab5:");
  });

  test("deletes cached values by prefix", () => {
    setCached("lab5:test:one", 1);
    setCached("lab5:test:two", 2);

    deleteCachedByPrefix("lab5:test:");

    expect(getCached<number>("lab5:test:one")).toBeNull();
    expect(getCached<number>("lab5:test:two")).toBeNull();
  });
});
