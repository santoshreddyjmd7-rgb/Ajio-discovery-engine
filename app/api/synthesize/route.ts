import { NextResponse } from "next/server";
import { themeFrequency, topCrossPatterns, sampleQuotesForTheme, corpusSummary } from "@/lib/aggregate";
import { THEMES } from "@/lib/data";

// ---- STAGE: SYNTHESIZE ----
// This is the ONLY place an LLM touches this pipeline. It receives
// pre-computed counts and real quotes — never the raw corpus, never
// free recall. This is what stops it from inventing a statistic.

export async function GET() {
  const freq = themeFrequency();
  const crossPatterns = topCrossPatterns(5);
  const summary = corpusSummary();

  const evidenceBlock = crossPatterns
    .map((cp) => {
      const [a, b] = cp.pair;
      const quotes = sampleQuotesForTheme(a, 2)
        .map((q) => `  - [${q.id}] "${q.evidence}"`)
        .join("\n");
      return `Pattern: ${THEMES[a]} + ${THEMES[b]} (co-occurs in ${cp.count} reviews)\n${quotes}`;
    })
    .join("\n\n");

  const freqBlock = freq
    .map((f) => `- ${f.label}: ${f.count}/${summary.total} reviews (${f.pct}%)`)
    .join("\n");

  const prompt = `You are analyzing AJIO (fashion e-commerce) user review data for a product manager.

STRICT RULES:
- Use ONLY the numbers and quotes given below. Never invent a percentage, count, or claim not present in this data.
- If asked something the data doesn't cover, say so explicitly instead of guessing.
- Every claim must be traceable to a review ID or a count below.

THEME FREQUENCY (n=${summary.total} reviews):
${freqBlock}

TOP CO-OCCURRING PATTERNS (with sample evidence):
${evidenceBlock}

TASK: Write 3 short, PM-facing insights (2-3 sentences each) that a wishlist-to-purchase conversion project could act on. Each insight must cite specific numbers and at least one review ID. End with one sentence naming what this data does NOT tell us (a limitation), so the reader knows the boundary of what was actually validated.`;

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not set. Add it in Vercel project settings." },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Anthropic API error: ${errText}` }, { status: 500 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "No response generated.";

    return NextResponse.json({ insight: text, groundedIn: { freq, crossPatterns, summary } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
