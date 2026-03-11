import { describe, it, expect } from "vitest";
import { getGameDate, getGameNumber, getNextMidnight } from "@/lib/game/date-utils";

describe("getGameDate", () => {
  it("returns a date string in YYYY-MM-DD format", () => {
    const date = getGameDate();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getGameNumber", () => {
  it("returns 1 for the launch date", () => {
    expect(getGameNumber("2026-03-11")).toBe(1);
  });

  it("returns correct number for subsequent days", () => {
    expect(getGameNumber("2026-03-12")).toBe(2);
    expect(getGameNumber("2026-03-21")).toBe(11);
  });
});

describe("getNextMidnight", () => {
  it("returns a future date", () => {
    const midnight = getNextMidnight();
    expect(midnight.getTime()).toBeGreaterThan(Date.now());
  });

  it("returns a date within 24 hours", () => {
    const midnight = getNextMidnight();
    const diffMs = midnight.getTime() - Date.now();
    expect(diffMs).toBeLessThanOrEqual(24 * 60 * 60 * 1000);
    expect(diffMs).toBeGreaterThan(0);
  });
});
