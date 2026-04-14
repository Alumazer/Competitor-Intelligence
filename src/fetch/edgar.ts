// ─── SEC EDGAR — Placeholder ──────────────────────────────────────────────────
//
// None of the current competitors (Airwallex, Wise, Revolut, Mercury,
// PingPong, Aspire, WorldFirst) file with the SEC. Wise is LSE-listed;
// all others are private.
//
// This module is a placeholder for future competitors that may be
// US-listed. When a CIK is added to a competitor's config, this
// will fetch recent 10-K, 10-Q, and 8-K filings from EDGAR.
//
// EDGAR submissions API: https://data.sec.gov/submissions/CIK{cik}.json
// No API key required — rate limit: 10 req/sec.

import type { CompetitorConfig, IntelItem } from '../types/index.js';

export async function fetchEdgarFilings(
  competitor: CompetitorConfig
): Promise<IntelItem[]> {
  if (!competitor.cik) return [];

  // Placeholder — implement when needed
  console.log(`[edgar] CIK ${competitor.cik} found for ${competitor.displayName} — EDGAR fetch not yet implemented.`);
  return [];
}
