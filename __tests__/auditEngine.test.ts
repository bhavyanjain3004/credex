import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/auditEngine";
import type { Subscription } from "@/types";

describe("runAudit", () => {
  it("returns no flags for a subscription within canonical price", () => {
    const subs: Subscription[] = [
      { tool: "ChatGPT", plan: "Plus", seats: 1, monthlyCost: 20 },
    ];
    const result = runAudit(subs);
    expect(result.flags).toHaveLength(0);
    expect(result.monthlySavings).toBe(0);
    expect(result.annualSavings).toBe(0);
  });

  it("flags a subscription that is overpriced", () => {
    const subs: Subscription[] = [
      { tool: "ChatGPT", plan: "Team", seats: 1, monthlyCost: 50 },
    ];
    const result = runAudit(subs);
    expect(result.flags).toHaveLength(1);
    expect(result.flags[0].savings).toBe(30);
    expect(result.monthlySavings).toBe(30);
    expect(result.annualSavings).toBe(360);
  });

  it("accounts for seat count in savings calculation", () => {
    const subs: Subscription[] = [
      { tool: "GitHub Copilot", plan: "Business", seats: 5, monthlyCost: 95 },
    ];
    const result = runAudit(subs);
    // canonical = 10 * 5 = 50, savings = 95 - 50 = 45
    expect(result.flags[0].savings).toBe(45);
  });

  it("skips unknown tools gracefully", () => {
    const subs: Subscription[] = [
      { tool: "SomeUnknownTool", plan: "Pro", seats: 1, monthlyCost: 99 },
    ];
    const result = runAudit(subs);
    expect(result.flags).toHaveLength(0);
    expect(result.audited).toBe(1);
  });

  it("handles an empty subscription list", () => {
    const result = runAudit([]);
    expect(result.flags).toHaveLength(0);
    expect(result.monthlySavings).toBe(0);
    expect(result.audited).toBe(0);
  });
});
