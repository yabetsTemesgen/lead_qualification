import { NextResponse } from "next/server";
import { calculateLeadScore } from "@/lib/chat/scoring";
import { leadSubmissionSchema } from "@/lib/chat/validation";

const recentSubmissions = new Map<string, number>();
const DEDUP_WINDOW_MS = 5 * 60 * 1000;

function isDuplicate(email: string, clientSubmissionId?: string): boolean {
  const key = clientSubmissionId ?? email.toLowerCase();
  const last = recentSubmissions.get(key);
  if (last && Date.now() - last < DEDUP_WINDOW_MS) return true;
  recentSubmissions.set(key, Date.now());
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (isDuplicate(data.email, data.clientSubmissionId)) {
      return NextResponse.json(
        { error: "This inquiry was already submitted. Please wait a few minutes." },
        { status: 409 },
      );
    }

    const score = calculateLeadScore(data.budget, data.timeline);
    const timestamp = new Date().toISOString();

    const payload = {
      timestamp,
      name: data.fullName,
      email: data.email,
      company: data.companyName,
      phone: data.phone ?? "",
      service: data.service,
      budget: data.budget,
      timeline: data.timeline,
      score,
      status: "New",
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (webhookUrl) {
      const n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const n8nText = await n8nResponse.text();

      if (!n8nResponse.ok) {
        console.error("n8n webhook failed:", n8nResponse.status, n8nText);
        return NextResponse.json(
          { error: "Failed to process your inquiry. Please try again later." },
          { status: 502 },
        );
      }

      try {
        const n8nJson = JSON.parse(n8nText) as { ok?: boolean };
        if (n8nJson.ok === false) {
          console.error("n8n workflow returned error:", n8nText);
          return NextResponse.json(
            { error: "Failed to process your inquiry. Please try again later." },
            { status: 502 },
          );
        }
      } catch {
        // Non-JSON response is fine if HTTP status was 2xx
      }
    } else if (process.env.NODE_ENV === "production") {
      console.error("N8N_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Lead processing is not configured." },
        { status: 503 },
      );
    } else {
      console.info("[dev] Lead captured (no N8N_WEBHOOK_URL):", payload);
    }

    return NextResponse.json({
      ok: true,
      score,
      message: "Your inquiry has been submitted successfully.",
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
