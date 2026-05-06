// Shared TypeScript types for StackLeak

export interface Subscription {
  tool: string;       // e.g. "ChatGPT", "GitHub Copilot"
  plan: string;       // e.g. "Pro", "Team"
  seats: number;      // number of seats / licences
  monthlyCost: number; // total monthly cost in USD
}

export interface Alternative {
  name: string;
  plan: string;
  monthlyCost: number;
  savings: number;
  url: string;
}

export interface OverspendFlag {
  tool: string;
  reason: string;            // "Overpriced plan" | "Duplicate coverage" | "Unused tier"
  currentCost: number;
  recommendedCost: number;
  savings: number;
  alternatives: Alternative[];
}

export interface AuditResult {
  flags: OverspendFlag[];
  monthlySavings: number;
  annualSavings: number;
  audited: number;           // total subscriptions analysed
}

export interface Lead {
  id: string;
  slug: string;
  email: string;
  auditInput: Subscription[];
  auditResult: AuditResult;
  monthlySavings: number;
  annualSavings: number;
  createdAt: string;
}
