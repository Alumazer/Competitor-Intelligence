// ─── Competitor config ───────────────────────────────────────────────────────

export interface CompetitorConfig {
  id: string;              // slug: "airwallex", "wise", etc.
  displayName: string;     // "Airwallex"
  newsQuery: string;       // NewsAPI query string
  blogRssUrl?: string;     // RSS feed for blog posts
  pressRssUrl?: string;    // RSS feed for press releases
  pricingUrl?: string;     // URL to monitor for pricing changes
  rnsUrl?: string;         // LSE Regulatory News Service (Wise only)
  cik?: string;            // SEC EDGAR CIK — placeholder for public companies
  ticker?: string;         // Stock ticker — placeholder
}

// ─── Normalized intel item ────────────────────────────────────────────────────

export type SignalType =
  | 'financial'    // funding, revenue, earnings
  | 'product'      // launches, features, updates
  | 'ma'           // mergers, acquisitions, partnerships
  | 'regulatory'   // licenses, fines, regulatory actions
  | 'pricing'      // pricing or packaging changes
  | 'other';

export type SourceType =
  | 'news'
  | 'blog'
  | 'press'
  | 'pricing-diff'
  | 'filing';

export interface IntelItem {
  id: string;              // hash of URL — deduplication key
  competitorId: string;    // matches CompetitorConfig.id
  type: SourceType;
  signal: SignalType;
  title: string;
  date: string;            // ISO 8601
  url: string;
  snippet: string;         // short excerpt or summary
  fetchedAt: string;       // ISO 8601 — when we collected this
}

// ─── Pricing diff ─────────────────────────────────────────────────────────────

export interface PricingSnapshot {
  competitorId: string;
  url: string;
  contentHash: string;     // hash of page text — used to detect changes
  capturedAt: string;      // ISO 8601
  textSample: string;      // first 2000 chars of page text for context
}

export interface PricingDiff {
  competitorId: string;
  url: string;
  detectedAt: string;
  previous: PricingSnapshot;
  current: PricingSnapshot;
  summary: string;         // human-readable diff summary
}

// ─── Cache entry ──────────────────────────────────────────────────────────────

export interface CacheEntry {
  competitorId: string;
  sourceType: SourceType;
  fetchedAt: string;       // ISO 8601
  data: IntelItem[];
}

// ─── Daily report ─────────────────────────────────────────────────────────────

export interface DailyReport {
  generatedAt: string;
  anchorCompany: string;
  items: IntelItem[];
  pricingDiffs: PricingDiff[];
  byCompetitor: Record<string, IntelItem[]>;
  bySignal: Record<SignalType, IntelItem[]>;
}
