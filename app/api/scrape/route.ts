import { NextResponse } from "next/server";
import gplay from "google-play-scraper";
import { THEMES } from "@/lib/data";

// ---- STAGE: INGEST (live) ----
// This route fetches REAL, CURRENT reviews from the Play Store at request
// time — not a static snapshot. It runs server-side (Vercel serverless
// function), which is why it can reach Play Store at all; a browser
// cannot make this call directly (CORS blocks it).

// Deterministic keyword -> theme mapping (same closed taxonomy as the
// static corpus). No LLM is used to tag — this is plain string matching,
// so it's exactly as auditable as the pre-tagged data.
const KEYWORD_MAP: Record<string, string[]> = {
  return_friction: ["return", "pickup", "tag missing", "rejected"],
  refund_delay: ["refund", "money not", "money stuck", "not received"],
  waited: ["waiting", "days", "weeks", "delay", "delayed"],
  size_fit: ["size", "fit", "small", "large", "tight", "loose"],
  quality: ["quality", "defective", "damaged", "poor material", "torn"],
  delivery: ["delivery", "not delivered", "cancelled", "late"],
  support: ["customer care", "support", "helpline", "no response"],
  availability: ["out of stock", "unavailable", "not available"],
  wrong_item: ["wrong item", "wrong product", "different item", "missing item"],
  trust: ["fake", "fraud", "scam", "duplicate", "authentic"],
  app_tech: ["app crash", "app not working", "bug", "glitch"],
  positive_workaround: ["worked fine", "quick", "resolved", "happy"],
};

function tagReview(text: string): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const [theme, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((k) => lower.includes(k))) hits.push(theme);
  }
  return hits;
}

export async function GET() {
  try {
    const reviews = await gplay.reviews({
      appId: "com.ril.ajio",
      sort: gplay.sort.NEWEST,
      num: 50,
    });

    const tagged = reviews.data.map((r: any) => ({
      id: r.id,
      source: "Google Play (live)",
      date: r.date,
      author: r.userName,
      evidence: r.text,
      themes: tagReview(r.text ?? ""),
    }));

    // Only keep reviews that matched at least one theme — untagged text
    // isn't useful for the frequency counts and would just be noise.
    const relevant = tagged.filter((r) => r.themes.length > 0);

    return NextResponse.json({
      fetchedAt: new Date().toISOString(),
      totalFetched: reviews.data.length,
      totalTagged: relevant.length,
      reviews: relevant,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Live fetch failed: ${e.message}. Play Store may be rate-limiting or blocking this request — the static 45-review corpus above remains the reliable dataset for the deck.` },
      { status: 500 }
    );
  }
}
