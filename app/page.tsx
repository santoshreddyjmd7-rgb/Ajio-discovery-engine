"use client";

import { useState } from "react";
import { themeFrequency, topCrossPatterns, corpusSummary } from "@/lib/aggregate";
import { THEMES } from "@/lib/data";

export default function Home() {
  const freq = themeFrequency();
  const crossPatterns = topCrossPatterns(5);
  const summary = corpusSummary();

  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ text: string; grounded: boolean; matches: string[] } | null>(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const [liveReviews, setLiveReviews] = useState<any[] | null>(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveFetchedAt, setLiveFetchedAt] = useState<string | null>(null);

  async function fetchLive() {
    setLoadingLive(true);
    setLiveError(null);
    try {
      const res = await fetch("/api/scrape");
      const data = await res.json();
      if (data.error) {
        setLiveError(data.error);
      } else {
        setLiveReviews(data.reviews);
        setLiveFetchedAt(data.fetchedAt);
      }
    } catch (e: any) {
      setLiveError(e.message);
    }
    setLoadingLive(false);
  }

  async function runSynthesis() {
    setLoadingInsight(true);
    setInsight("");
    try {
      const res = await fetch("/api/synthesize");
      const data = await res.json();
      setInsight(data.insight ?? data.error ?? "No response");
    } catch (e: any) {
      setInsight("Error: " + e.message);
    }
    setLoadingInsight(false);
  }

  async function runQuery() {
    if (!question.trim()) return;
    setLoadingAnswer(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer({ text: data.answer ?? data.error, grounded: data.grounded ?? false, matches: data.matches ?? [] });
    } catch (e: any) {
      setAnswer({ text: "Error: " + e.message, grounded: false, matches: [] });
    }
    setLoadingAnswer(false);
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px", fontFamily: "system-ui, sans-serif", color: "#1a1a1a" }}>
      <header style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#c026d3", letterSpacing: 0.5 }}>AJIO · PART 1 · AI DISCOVERY ENGINE</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "6px 0 8px", lineHeight: 1.25 }}>
          {freq[0]?.pct}% of reviews cite {freq[0]?.label.toLowerCase()} — the dominant wishlist-to-purchase blocker
        </h1>
        <p style={{ color: "#555", fontSize: 15 }}>
          {summary.total} tagged reviews across {Object.keys(summary.bySource).length} sources. Every number below is a deterministic count against a closed taxonomy — no LLM touches the tagging or the math. The LLM only synthesizes insight from these numbers, and can be queried live below.
        </p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 32 }}>
        <StatCard label="Reviews tagged" value={String(summary.total)} />
        <StatCard label="Sources" value={String(Object.keys(summary.bySource).length)} />
        <StatCard label="Themes (closed taxonomy)" value={String(Object.keys(THEMES).length)} />
        <StatCard label="Top theme rate" value={`${freq[0]?.pct}%`} />
      </section>

      <Section title="Live fetch — pull current AJIO Play Store reviews on demand">
        <button onClick={fetchLive} disabled={loadingLive} style={btnStyle}>
          {loadingLive ? "Fetching from Play Store…" : "Fetch live reviews"}
        </button>
        {liveError && (
          <div style={{ marginTop: 12, fontSize: 13, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 10 }}>
            {liveError}
          </div>
        )}
        {liveReviews && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
              Fetched {liveReviews.length} theme-relevant reviews just now ({liveFetchedAt ? new Date(liveFetchedAt).toLocaleString() : ""}) — tagged with the same deterministic keyword matcher as the static corpus, no LLM involved in tagging.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
              {liveReviews.slice(0, 15).map((r: any) => (
                <div key={r.id} style={{ fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: 8 }}>
                  <b>{r.themes.join(", ") || "untagged"}</b> — {r.evidence?.slice(0, 140)}
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section title="Theme frequency (deterministic — pure count, no LLM)">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {freq.map((f) => (
            <div key={f.id}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                <span>{f.label}</span>
                <span style={{ fontWeight: 700 }}>{f.count} · {f.pct}%</span>
              </div>
              <div style={{ background: "#eee", borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${f.pct}%`, background: "#c026d3", height: "100%" }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Top co-occurring theme pairs (cross-pattern, deterministic)">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {crossPatterns.map((cp, i) => (
            <div key={i} style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {THEMES[cp.pair[0]]} + {THEMES[cp.pair[1]]}
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>Co-occurs in {cp.count} reviews · {cp.reviewIds.slice(0, 5).join(", ")}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="AI synthesis (grounded — reads only the counts above)">
        <button onClick={runSynthesis} disabled={loadingInsight} style={btnStyle}>
          {loadingInsight ? "Synthesizing…" : insight ? "Re-run synthesis" : "Generate insight"}
        </button>
        {insight && (
          <div style={{ marginTop: 14, whiteSpace: "pre-wrap", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: 14, fontSize: 14, lineHeight: 1.6 }}>
            {insight}
          </div>
        )}
      </Section>

      <Section title="Ask the corpus (RAG — refuses when evidence is thin)">
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runQuery()}
            placeholder="e.g. Why do users hesitate before buying a wishlisted item?"
            style={{ flex: 1, padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14 }}
          />
          <button onClick={runQuery} disabled={loadingAnswer} style={btnStyle}>
            {loadingAnswer ? "…" : "Ask"}
          </button>
        </div>
        {answer && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: answer.grounded ? "#15803d" : "#b45309", marginBottom: 6 }}>
              {answer.grounded ? `Grounded in ${answer.matches.length} reviews` : "Insufficient evidence — refused to guess"}
            </div>
            <div style={{ whiteSpace: "pre-wrap", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, fontSize: 14, lineHeight: 1.6 }}>
              {answer.text}
            </div>
          </div>
        )}
      </Section>

      <Section title="Pipeline & guardrails">
        <ol style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.9, color: "#333" }}>
          <li><b>Ingest</b> — {summary.total} reviews collected across {Object.keys(summary.bySource).length} sources (Play Store, App Store, Reddit, Trustpilot, PissedConsumer, and others).</li>
          <li><b>Classify</b> — each review hand-tagged against a closed 12-theme taxonomy (no LLM invents new tags).</li>
          <li><b>Aggregate</b> — theme frequency and cross-pattern counts computed in plain code, zero LLM involvement.</li>
          <li><b>Synthesize</b> — one Claude API call (Anthropic, Claude Haiku 4.5) reads only the aggregated counts + sample quotes, cites review IDs, states its own limitations.</li>
          <li><b>Serve</b> — this live dashboard, plus a RAG query panel that retrieves matching reviews first and refuses to answer when fewer than 2 reviews support a claim.</li>
        </ol>
      </Section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fdf4ff", border: "1px solid #f0abfc", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#555" }}>{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 30 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

const btnStyle: React.CSSProperties = {
  background: "#c026d3",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};
