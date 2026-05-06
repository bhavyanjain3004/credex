import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/auditEngine";
import type { Subscription } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const subscriptions: Subscription[] = body.subscriptions;

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return NextResponse.json(
        { error: "subscriptions must be a non-empty array" },
        { status: 400 }
      );
    }

    const result = runAudit(subscriptions);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
