# AJIO Discovery Engine — Deploy Guide

Same deploy path you used for ReviewLens: GitHub + Vercel, ~10 minutes.
Uses your existing Anthropic API credits — no new signup needed.

## 1. Get your Anthropic API key
- Go to https://console.anthropic.com/settings/keys (log in with the
  account you used to buy the $5 credit)
- Create an API key, copy it. Each call in this app costs a fraction
  of a cent (Claude Haiku 4.5) — your $5 covers this project many times over.

## 2. Push this folder to a new GitHub repo
```
cd ajio-discovery-engine
git init
git add .
git commit -m "AJIO discovery engine"
gh repo create ajio-discovery-engine --public --source=. --push
```
(No `gh` CLI? Create a repo on github.com, then:
```
git remote add origin https://github.com/<you>/ajio-discovery-engine.git
git branch -M main
git push -u origin main
```)

## 3. Deploy to Vercel
- Go to https://vercel.com/new
- Import the GitHub repo
- Before deploying, add an Environment Variable:
  - Key: `ANTHROPIC_API_KEY`
  - Value: (the key from step 1)
- Click Deploy.

## 4. You're live
Vercel gives you a URL like `ajio-discovery-engine.vercel.app` — that's your
Part 1 deliverable link. Test the "Generate insight" and "Ask the corpus"
buttons once.

## What's real vs what's AI here (for your deck)
- **Ingest, Classify, Aggregate**: 100% deterministic code (`lib/data.ts`,
  `lib/aggregate.ts`). No LLM involved. This is why the percentages on the
  dashboard are facts, not model guesses.
- **Synthesize, Serve (chat)**: the only two places an LLM (Claude Haiku
  4.5, via your Anthropic API credits) is called — and both are grounded:
  the model only ever sees the pre-computed counts and real review quotes,
  never the full raw corpus, and the chat panel explicitly refuses to
  answer when fewer than 2 reviews support a claim.
