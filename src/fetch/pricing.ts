import { createHash } from 'crypto';
import type { CompetitorConfig, IntelItem, PricingDiff, PricingSnapshot } from '../types/index.js';
import { getPricingSnapshot, savePricingSnapshot, makeId } from '../db/cache.js';

// ─── Text extractor ───────────────────────────────────────────────────────────
// Strips HTML tags and collapses whitespace for clean diffing

function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hashContent(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

// ─── Fetch and diff pricing page ──────────────────────────────────────────────

export async function checkPricingPage(
  competitor: CompetitorConfig
): Promise<PricingDiff | null> {
  if (!competitor.pricingUrl) return null;

  const res = await fetch(competitor.pricingUrl, {
    headers: {
      'User-Agent': 'CompetitorIntelBot/2.0 (internal monitoring)',
      'Accept': 'text/html',
    },
  });

  if (!res.ok) {
    console.warn(`[pricing] Failed to fetch ${competitor.pricingUrl}: ${res.status}`);
    return null;
  }

  const html = await res.text();
  const text = extractText(html);
  const hash = hashContent(text);
  const now = new Date().toISOString();

  const current: PricingSnapshot = {
    competitorId: competitor.id,
    url: competitor.pricingUrl,
    contentHash: hash,
    capturedAt: now,
    textSample: text.slice(0, 2000),
  };

  const previous = getPricingSnapshot(competitor.id);

  // Save current snapshot
  savePricingSnapshot(current);

  // No previous snapshot — first run, nothing to diff
  if (!previous) return null;

  // No change detected
  if (previous.contentHash === current.contentHash) return null;

  // Change detected — return diff
  return {
    competitorId: competitor.id,
    url: competitor.pricingUrl,
    detectedAt: now,
    previous,
    current,
    summary: `Pricing page changed for ${competitor.displayName}. Previous snapshot: ${previous.capturedAt}. Review the page for fee or plan changes.`,
  };
}

// ─── Convert pricing diff to intel item ───────────────────────────────────────

export function pricingDiffToIntelItem(diff: PricingDiff, displayName: string): IntelItem {
  return {
    id: makeId(`pricing-diff-${diff.competitorId}-${diff.detectedAt}`),
    competitorId: diff.competitorId,
    type: 'pricing-diff',
    signal: 'pricing',
    title: `${displayName} — pricing page updated`,
    date: diff.detectedAt,
    url: diff.url,
    snippet: diff.summary,
    fetchedAt: diff.detectedAt,
  };
}
