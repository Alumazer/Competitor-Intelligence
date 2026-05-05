import { XMLParser } from 'fast-xml-parser';
import type { CompetitorConfig, IntelItem, SourceType } from '../types/index.js';
import { isCacheStale, saveItems, makeId } from '../db/cache.js';
import { classifySignal } from '../utils/signals.js';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

// ─── Date helpers ─────────────────────────────────────────────────────────────

function parseDate(raw: string | undefined): string {
  if (!raw) return new Date().toISOString();
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// ─── Generic RSS/Atom fetcher ─────────────────────────────────────────────────

async function fetchFeed(
  url: string,
  competitorId: string,
  sourceType: SourceType,
  lookbackDays = 1
): Promise<IntelItem[]> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CompetitorIntelBot/2.0 (internal monitoring)' },
  });

  if (!res.ok) throw new Error(`RSS fetch failed (${res.status}): ${url}`);

  const xml = await res.text();
  const parsed = parser.parse(xml);

  const now = new Date().toISOString();

  // Support both RSS <channel><item> and Atom <feed><entry>
  const channel = parsed?.rss?.channel ?? parsed?.feed;
  const rawItems: Array<Record<string, unknown>> = Array.isArray(channel?.item)
    ? channel.item
    : Array.isArray(channel?.entry)
    ? channel.entry
    : [];

  // Build a cutoff date to match the lookback window used by the NewsAPI fetcher.
  // Parse up to 50 entries before filtering so we don't discard items just because
  // the feed puts them after newer content.
  const cutoff = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString();

  return rawItems
    .slice(0, 50)
    .map((entry) => {
      const title = String(entry.title ?? '');
      const link =
        typeof entry.link === 'string'
          ? entry.link
          : (entry.link as { '@_href': string })?.['@_href'] ?? String(entry.guid ?? '');
      const snippet = String(
        entry.description ?? entry.summary ?? entry.content ?? ''
      ).replace(/<[^>]+>/g, '').slice(0, 300);
      const date = parseDate(String(entry.pubDate ?? entry.updated ?? entry.published ?? ''));

      return {
        id: makeId(link),
        competitorId,
        type: sourceType,
        signal: classifySignal(`${title} ${snippet}`),
        title,
        date,
        url: link,
        snippet,
        fetchedAt: now,
      } satisfies IntelItem;
    })
    .filter((item) => item.date >= cutoff); // Only return items within the lookback window
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchRssFeeds(
  competitor: CompetitorConfig,
  forceRefresh = false
): Promise<IntelItem[]> {
  const results: IntelItem[] = [];

  // Blog feed
  if (competitor.blogRssUrl) {
    if (forceRefresh || isCacheStale(competitor.id, 'blog')) {
      try {
        const items = await fetchFeed(competitor.blogRssUrl, competitor.id, 'blog');
        saveItems(items, competitor.id, 'blog');
        results.push(...items);
      } catch (e) {
        console.warn(`[rss] Blog feed failed for ${competitor.id}:`, e);
      }
    }
    // Cache is fresh: items from this feed were already included in a prior email — skip.
  }

  // Press release feed
  if (competitor.pressRssUrl) {
    if (forceRefresh || isCacheStale(competitor.id, 'press')) {
      try {
        const items = await fetchFeed(competitor.pressRssUrl, competitor.id, 'press');
        saveItems(items, competitor.id, 'press');
        results.push(...items);
      } catch (e) {
        console.warn(`[rss] Press feed failed for ${competitor.id}:`, e);
      }
    }
    // Cache is fresh: skip.
  }

  return results;
}
