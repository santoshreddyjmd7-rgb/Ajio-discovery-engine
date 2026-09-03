import { REVIEWS, THEMES } from "./data";

// ---- STAGE: AGGREGATE (deterministic, zero LLM) ----
// Every number below is produced by counting the tagged corpus.
// No model is involved in this file. This is the guardrail that
// makes "58% of reviews mention return friction" a fact, not a guess.

export type ThemeStat = {
  id: string;
  label: string;
  count: number;
  pct: number;
};

export function themeFrequency(): ThemeStat[] {
  const total = REVIEWS.length;
  const counts: Record<string, number> = {};
  for (const id of Object.keys(THEMES)) counts[id] = 0;

  for (const r of REVIEWS) {
    for (const t of r.themes) {
      counts[t] = (counts[t] ?? 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([id, count]) => ({
      id,
      label: THEMES[id],
      count,
      pct: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}

export type CrossPattern = {
  pair: [string, string];
  count: number;
  reviewIds: string[];
};

export function topCrossPatterns(limit = 5): CrossPattern[] {
  const pairCounts: Record<string, { count: number; ids: string[] }> = {};

  for (const r of REVIEWS) {
    const uniqueThemes = Array.from(new Set(r.themes));
    for (let i = 0; i < uniqueThemes.length; i++) {
      for (let j = i + 1; j < uniqueThemes.length; j++) {
        const pair = [uniqueThemes[i], uniqueThemes[j]].sort();
        const key = pair.join("|");
        if (!pairCounts[key]) pairCounts[key] = { count: 0, ids: [] };
        pairCounts[key].count++;
        pairCounts[key].ids.push(r.id);
      }
    }
  }

  return Object.entries(pairCounts)
    .map(([key, v]) => ({
      pair: key.split("|") as [string, string],
      count: v.count,
      reviewIds: v.ids,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function sampleQuotesForTheme(themeId: string, n = 3) {
  return REVIEWS.filter((r) => r.themes.includes(themeId)).slice(0, n);
}

export function corpusSummary() {
  const bySource: Record<string, number> = {};
  for (const r of REVIEWS) {
    bySource[r.source] = (bySource[r.source] ?? 0) + 1;
  }
  return {
    total: REVIEWS.length,
    bySource,
  };
}
