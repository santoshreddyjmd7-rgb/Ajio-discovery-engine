import { NextResponse } from "next/server";
import { REVIEWS, THEMES } from "@/lib/data";
import { themeFrequency } from "@/lib/aggregate";

// ---- STAGE: SERVE (RAG chat) ----
// Retrieves the most relevant tagged reviews for a question, then
// asks the LLM to answer ONLY from those. If evidence is thin
// (fewer than 2 matching reviews), it says so instead of guessing.

function retrieve(question: string, limit = 12) {
  const q = question.toLowerCase();
  const themeHits = Object.entries(THEMES)
    .filter(([id, label]) => q.includes(id.replace("_", " ")) || label.toLowerCase().split(" ").some((w) => q.includes(w)))
    .map(([id]) => id);

  let matched = REVIEWS.filter((r) => r.themes.some((t) => themeHits.includes(t)));
  if (matched.length === 0) {
    // fallback: keyword match against raw evidence text
    matched = REVIEWS.filter((r) => r.evidence.toLowerCase().includes(q.slice(0, 20)));
  }
  return matched.slice(0, limit);
}

export async function POST(req: Request) {
  const { question } = await req.json();
  if (!question) return NextResponse.json({ error: "No question provided" }, { status: 400 });

  const matches = retrieve(question);
  const freq = themeFrequency();

  if (matches.length < 2) {
    return NextResponse.json({
      answer: `The corpus doesn't have enough tagged evidence (${matches.length} matching review${matches.length === 1 ? "" : "s"}) to answer this reliably. Try asking about return friction, refund delay, size/fit, quality, delivery, trust, or support — the themes with the most coverage.`,
      grounded: false,
      matches: [],
    });
  }

  const context = matches.map((r) => `[${r.id}, ${r.source}] "${r.evidence}" (themes: ${r.themes.join(", ")})`).join("\n");
  const freqLine = freq.map((f) => `${f.label}: ${f.pct}%`).join("; ");

  const prompt = `Answer the PM's question using ONLY the review evidence below. Cite review IDs like [T-05] for every claim. If the evidence doesn't fully answer the question, say what's missing.

CORPUS THEME RATES: ${freqLine}

RELEVANT REVIEWS:
${context}

QUESTION: ${question}`;

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not set." }, { status: 500 });
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
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Anthropic API error: ${errText}` }, { status: 500 });
    }
    const data = await res.json();
    const answer = data.content?.[0]?.text ?? "No response generated.";
    return NextResponse.json({ answer, grounded: true, matches: matches.map((m) => m.id) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
