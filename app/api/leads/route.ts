import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateSlug } from "@/lib/slugify";
import type { Subscription, AuditResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, auditInput, auditResult }: {
      email: string;
      auditInput: Subscription[];
      auditResult: AuditResult;
    } = body;

    if (!email || !auditInput || !auditResult) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = generateSlug(8);
    const admin = supabaseAdmin();

    const { error } = await admin.from("leads").insert({
      slug,
      email,
      audit_input: auditInput,
      audit_result: auditResult,
      monthly_savings: auditResult.monthlySavings,
      annual_savings: auditResult.annualSavings,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/r/${slug}`;
    return NextResponse.json({ slug, shareUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
