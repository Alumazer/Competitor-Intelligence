import { createHash } from 'crypto';
import type { CompetitorConfig, IntelItem, SignalType } from '../types/index.js';
import { isCacheStale, saveItems, getItems, makeId } from '../db/cache.js';

const NEWS_API_KEY = process.env.NEWS_API_KEY!;
const BASE_URL = 'https://newsapi.org/v2/everything';

// ─── Signal classifier ────────────────────────────────────────────────────────
// Maps keywords in title/snippet to signal types

function classifySignal(text: string): SignalType {
  const t = text.toLowerCase();
  if (/acqui|merger|acquis|partner|deal|joint venture/.test(t))      return 'ma';
  if (/licen|regulat|fine|penalty|sanction|compliance|authority/.test(t)) return 'regulatory';
  if (/pric|fee|plan|packag|subscript|cost|charge/.test(t))          return 'pricing';
  if (/revenue|funding|raise|valuat|ipo|earning|profit|loss|quarter/.test(t)) return 'financial';
  if (/launch|feature|product|update|release|new|api|integrat/.test(t)) return 'product';
  return 'other';
}

// ─── Fetch from NewsAPI ───────────────────────────────────────────────────────

interface NewsApiArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: { name: string };
}

interface NewsApiResponse {
  status: string;
  articles: NewsApiArticle[];
  message?: string;
}

export async function fetchNews(
  competitor: CompetitorConfig,
  forceRefresh = false,
  lookbackDays = 7
): Promise<IntelItem[]> {
  if (!forceRefresh && !isCacheStale(competitor.id, 'news')) {
    return getItems(competitor.id);
  }

  const from = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const params = new URLSearchParams({
    q: competitor.newsQuery,
    from,
    sortBy: 'publishedAt',
    language: 'en',
    pageSize: '20',
    apiKey: NEWS_API_KEY,
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`NewsAPI error ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as NewsApiResponse;
  if (data.status !== 'ok') throw new Error(`NewsAPI: ${data.message}`);

  const now = new Date().toISOString();
  const items: IntelItem[] = data.articles
    .filter((a) => a.title && a.url)
    .map((a) => {
      const text = `${a.title} ${a.description ?? ''}`;
      return {
        id: makeId(a.url),
        competitorId: competitor.id,
        type: 'news',
        signal: classifySignal(text),
        title: a.title,
        date: a.publishedAt,
        url: a.url,
        snippet: a.description ?? '',
        fetchedAt: now,
      } satisfies IntelItem;
    });

  saveItems(items, competitor.id, 'news');
  return items;
}
