import { describe, it, expect } from "vitest";
import { generateShareText, getTwitterShareUrl, getWhatsAppShareUrl } from "@/lib/game/share-text";

describe("generateShareText", () => {
  it("includes game number", () => {
    const text = generateShareText("2026-03-11", 5, 80);
    expect(text).toContain("PreciGame #1");
  });

  it("includes error percentage", () => {
    const text = generateShareText("2026-03-11", 12.5, 80);
    expect(text).toContain("Error: 12.5%");
  });

  it("includes percentile", () => {
    const text = generateShareText("2026-03-11", 12.5, 73);
    expect(text).toContain("Mejor que el 73% de jugadores");
  });

  it("does NOT include product name or price", () => {
    const text = generateShareText("2026-03-11", 12.5, 73);
    expect(text).not.toContain("Leche");
    expect(text).not.toContain("0.89");
    expect(text).not.toContain("1.95");
  });

  it("uses green emoji for excellent results", () => {
    const text = generateShareText("2026-03-11", 5, 90);
    expect(text).toContain("\uD83D\uDFE2");
  });

  it("uses yellow emoji for good results", () => {
    const text = generateShareText("2026-03-11", 15, 60);
    expect(text).toContain("\uD83D\uDFE1");
  });

  it("uses red emoji for poor results", () => {
    const text = generateShareText("2026-03-11", 30, 30);
    expect(text).toContain("\uD83D\uDD34");
  });
});

describe("getTwitterShareUrl", () => {
  it("returns a valid Twitter intent URL", () => {
    const url = getTwitterShareUrl("test text");
    expect(url).toContain("twitter.com/intent/tweet");
    expect(url).toContain("text=");
  });
});

describe("getWhatsAppShareUrl", () => {
  it("returns a valid WhatsApp share URL", () => {
    const url = getWhatsAppShareUrl("test text");
    expect(url).toContain("wa.me");
    expect(url).toContain("text=");
  });
});
