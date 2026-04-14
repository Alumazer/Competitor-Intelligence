import { XMLParser } from 'fast-xml-parser';
import type { CompetitorConfig, IntelItem, SignalType, SourceType } from '../types/index.js';
import { isCacheStale, saveItems, getItems, makeId } from '../db/cache.js';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

function classifySignal(text: string): SignalType {
  const t = text.toLowerCase();
  if (/acqui|merger|acquis|partner|deal/.test(t))                     return 'ma';
  if (/licen|regulat|fine|penalty|sanction|compliance/.test(t))       return 'regulatory';
  if (/pric|fee|plan|packag|subscript/.test(t))                       return 'pricing';
  if (/revenue|funding|raise|valuat|ipo|earning|profit|loss/.test(t)) return 'financial';
  if (/launch|feature|product|update|release|new|api/.test(t))        return 'product';
  return 'other';
}

function parseDate(raw: string | undefined): string {
  if (!raw) return new Date().toISOString();
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// ─── Generic RSS/Atom fetcher ─────────────────────────────────────────────────

async function fetchFeed(
  url: string,
  competitorId: string,
  sourceType: SourceType
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

  return rawItems.slice(0, 20).map((entry) => {
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
  });
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
    } else {
      results.push(...getItems(competitor.id));
    }
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
    } else {
      results.push(...getItems(competitor.id));
    }
  }

  return results;
}
