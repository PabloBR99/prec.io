import { describe, it, expect } from "vitest";
import { calculateError, getErrorLevel } from "@/lib/game/calculations";

describe("calculateError", () => {
  it("returns zero error for exact match", () => {
    const result = calculateError(1.95, 1.95);
    expect(result.errorAbs).toBe(0);
    expect(result.errorPct).toBe(0);
  });

  it("calculates error when guess is higher", () => {
    const result = calculateError(2.35, 1.95);
    expect(result.errorAbs).toBe(0.4);
    expect(result.errorPct).toBeCloseTo(20.51, 1);
  });

  it("calculates error when guess is lower", () => {
    const result = calculateError(1.55, 1.95);
    expect(result.errorAbs).toBe(0.4);
    expect(result.errorPct).toBeCloseTo(20.51, 1);
  });

  it("handles guess of zero", () => {
    const result = calculateError(0, 5.0);
    expect(result.errorAbs).toBe(5.0);
    expect(result.errorPct).toBe(100);
  });

  it("handles very small real price", () => {
    const result = calculateError(1.0, 0.01);
    expect(result.errorAbs).toBe(0.99);
    expect(result.errorPct).toBe(9900);
  });

  it("handles both zero (edge case)", () => {
    const result = calculateError(0, 0);
    expect(result.errorAbs).toBe(0);
    expect(result.errorPct).toBe(0);
  });
});

describe("getErrorLevel", () => {
  it("returns excellent for < 10%", () => {
    expect(getErrorLevel(0)).toBe("excellent");
    expect(getErrorLevel(5)).toBe("excellent");
    expect(getErrorLevel(9.99)).toBe("excellent");
  });

  it("returns good for 10-25%", () => {
    expect(getErrorLevel(10)).toBe("good");
    expect(getErrorLevel(15)).toBe("good");
    expect(getErrorLevel(24.99)).toBe("good");
  });

  it("returns poor for >= 25%", () => {
    expect(getErrorLevel(25)).toBe("poor");
    expect(getErrorLevel(50)).toBe("poor");
    expect(getErrorLevel(100)).toBe("poor");
  });
});
