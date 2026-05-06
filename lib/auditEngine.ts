import type { Subscription, AuditResult, OverspendFlag } from "@/types";
import tools from "@/data/tools.json";

interface ToolEntry {
  name: string;
  canonicalMonthly: number;   // cheapest equivalent plan cost (per seat)
  tags: string[];             // e.g. ["code", "llm", "image"]
  alternatives: {
    name: string;
    plan: string;
    monthlyCost: number;
    url: string;
  }[];
}

const toolDb: ToolEntry[] = tools as ToolEntry[];

/**
 * Runs the spend audit against the tool pricing database.
 * Pure function — no side effects, fully unit-testable.
 */
export function runAudit(subscriptions: Subscription[]): AuditResult {
  const flags: OverspendFlag[] = [];

  for (const sub of subscriptions) {
    const entry = toolDb.find(
      (t) => t.name.toLowerCase() === sub.tool.toLowerCase()
    );

    if (!entry) continue;

    const canonicalTotal = entry.canonicalMonthly * sub.seats;
    const savings = sub.monthlyCost - canonicalTotal;

    if (savings > 0) {
      flags.push({
        tool: sub.tool,
        reason: savings > sub.monthlyCost * 0.3 ? "Overpriced plan" : "Minor overspend",
        currentCost: sub.monthlyCost,
        recommendedCost: canonicalTotal,
        savings,
        alternatives: entry.alternatives.map((alt) => ({
          ...alt,
          savings: sub.monthlyCost - alt.monthlyCost * sub.seats,
        })),
      });
    }
  }

  const monthlySavings = flags.reduce((sum, f) => sum + f.savings, 0);

  return {
    flags,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    audited: subscriptions.length,
  };
}
