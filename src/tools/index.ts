import { competitors, competitorMap, ANCHOR_COMPANY } from '../config/competitors.js';
import { fetchNews } from '../fetch/news.js';
import { fetchRssFeeds } from '../fetch/rss.js';
import { checkPricingPage, pricingDiffToIntelItem } from '../fetch/pricing.js';
import { getItems, getAllItemsSince } from '../db/cache.js';
import type { IntelItem } from '../types/index.js';
import {
  GetNewsSchema, GetFeedsSchema, GetPricingDiffsSchema, GetBriefingSchema,
  type GetNewsInput, type GetFeedsInput, type GetPricingDiffsInput, type GetBriefingInput,
} from './schemas.js';

// ─── Tool: getNews ────────────────────────────────────────────────────────────

export async function getNews(raw: unknown): Promise<string> {
  const input: GetNewsInput = GetNewsSchema.parse(raw);
  const targets = input.competitorId
    ? [competitorMap.get(input.competitorId)!]
    : competitors;

  const all: IntelItem[] = [];
  for (const c of targets) {
    const items = await fetchNews(c, input.forceRefresh);
    all.push(...items);
  }

  let filtered = all;
  if (input.since) filtered = filtered.filter((i) => i.date >= input.since!);
  if (input.signal) filtered = filtered.filter((i) => i.signal === input.signal);
  filtered = filtered.slice(0, input.limit);

  if (filtered.length === 0) return 'No news items found for the given filters.';

  return filtered
    .map((i) => `[${i.signal.toUpperCase()}] ${i.date.slice(0, 10)} — **${i.competitorId}** — ${i.title}\n${i.snippet}\n${i.url}`)
    .join('\n\n');
}

// ─── Tool: getFeeds ───────────────────────────────────────────────────────────

export async function getFeeds(raw: unknown): Promise<string> {
  const input: GetFeedsInput = GetFeedsSchema.parse(raw);
  const targets = input.competitorId
    ? [competitorMap.get(input.competitorId)!]
    : competitors;

  const all: IntelItem[] = [];
  for (const c of targets) {
    try {
      const items = await fetchRssFeeds(c, input.forceRefresh);
      all.push(...items);
    } catch (e) {
      console.warn(`[tool:getFeeds] Failed for ${c.id}:`, e);
    }
  }

  let filtered = input.since ? all.filter((i) => i.date >= input.since!) : all;
  filtered = filtered.slice(0, input.limit);

  if (filtered.length === 0) return 'No blog or press items found.';

  return filtered
    .map((i) => `[${i.type.toUpperCase()}] ${i.date.slice(0, 10)} — **${i.competitorId}** — ${i.title}\n${i.snippet}\n${i.url}`)
    .join('\n\n');
}

// ─── Tool: getPricingDiffs ────────────────────────────────────────────────────

export async function getPricingDiffs(raw: unknown): Promise<string> {
  const input: GetPricingDiffsInput = GetPricingDiffsSchema.parse(raw);
  const targets = input.competitorId
    ? [competitorMap.get(input.competitorId)!]
    : competitors.filter((c) => c.pricingUrl);

  const diffs: string[] = [];
  for (const c of targets) {
    try {
      const diff = await checkPricingPage(c);
      if (diff) diffs.push(`**${c.displayName}**: ${diff.summary}\n${diff.url}`);
    } catch (e) {
      console.warn(`[tool:getPricingDiffs] Failed for ${c.id}:`, e);
    }
  }

  return diffs.length > 0
    ? diffs.join('\n\n')
    : 'No pricing changes detected since last check.';
}

// ─── Tool: getBriefing ────────────────────────────────────────────────────────

export async function getBriefing(raw: unknown): Promise<string> {
  const input: GetBriefingInput = GetBriefingSchema.parse(raw);
  const since = new Date(Date.now() - input.lookbackDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const items = input.competitorId
    ? getItems(input.competitorId, since, 50)
    : getAllItemsSince(since);

  if (items.length === 0) {
    return `No intelligence found for the past ${input.lookbackDays} day(s). Try running a fetch first.`;
  }

  const byCompetitor = new Map<string, IntelItem[]>();
  for (const item of items) {
    const list = byCompetitor.get(item.competitorId) ?? [];
    list.push(item);
    byCompetitor.set(item.competitorId, list);
  }

  const lines = [`## Competitor Intelligence Briefing — Last ${input.lookbackDays} day(s)\n`];
  lines.push(`*Anchor: ${ANCHOR_COMPANY}*\n`);

  for (const [cId, cItems] of byCompetitor) {
    const config = competitorMap.get(cId);
    lines.push(`### ${config?.displayName ?? cId} (${cItems.length} items)`);
    for (const i of cItems) {
      lines.push(`- **[${i.signal}]** ${i.date.slice(0, 10)}: ${i.title} — ${i.url}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Tool definitions (for Claude agent) ─────────────────────────────────────

export const toolDefinitions = [
  {
    name: 'getNews',
    description: `Fetch and return news articles about competitors from NewsAPI. Can filter by competitor, signal type (financial, product, ma, regulatory, pricing), and date. Always call this for broad monitoring questions.`,
    input_schema: GetNewsSchema,
  },
  {
    name: 'getFeeds',
    description: 'Fetch blog posts and press releases from competitor RSS feeds. Best for product releases and company announcements.',
    input_schema: GetFeedsSchema,
  },
  {
    name: 'getPricingDiffs',
    description: 'Check competitor pricing pages for changes since the last snapshot. Returns a diff summary if pricing has changed.',
    input_schema: GetPricingDiffsSchema,
  },
  {
    name: 'getBriefing',
    description: `Generate a structured intelligence briefing from cached data. Use this for "what happened with X" or "give me a daily briefing" queries. Frames findings relative to ${ANCHOR_COMPANY}.`,
    input_schema: GetBriefingSchema,
  },
] as const;
