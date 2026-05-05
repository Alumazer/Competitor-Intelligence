import type { CompetitorConfig } from '../types/index.js';

export const ANCHOR_COMPANY = 'Payoneer';

// ─────────────────────────────────────────────────────────────────────────────
// CORE COMPETITORS
// Direct platform rivals tracked in competition.md
// ─────────────────────────────────────────────────────────────────────────────

export const competitors: CompetitorConfig[] = [
  {
    id: 'airwallex',
    displayName: 'Airwallex',
    // Airwallex is a unique brand name — low noise risk, but add fintech context to avoid unrelated mentions
    newsQuery: '"Airwallex" AND (fintech OR payments OR "cross-border" OR neobank OR "business account") AND (funding OR revenue OR product OR launch OR license OR acquisition OR pricing OR regulation OR partnership)',
    blogRssUrl: 'https://www.airwallex.com/blog/feed',
    pricingUrl: 'https://www.airwallex.com/us/pricing',
  },
  {
    id: 'wise',
    displayName: 'Wise',
    // "Wise" is a common word. Require "Wise" + a payments/fintech context term to block
    // "moneywise", "streetwise" etc., while still catching articles like "Wise transactions grow 26%"
    newsQuery: '"Wise" AND ("cross-border" OR "money transfer" OR "remittance" OR "fintech" OR "payments" OR "TransferWise" OR "Wise.com" OR "foreign exchange" OR "currency" OR "IPO" OR "listing" OR "banking") AND (funding OR revenue OR growth OR product OR launch OR license OR acquisition OR pricing OR regulation OR partnership OR transactions)',
    blogRssUrl: 'https://wise.com/us/blog/feed',
    pressRssUrl: 'https://wise.com/gb/press/feed',
    pricingUrl: 'https://wise.com/us/pricing/send-money',
    rnsUrl: 'https://www.londonstockexchange.com/exchange/news/market-news/market-news-home.html?fourWayKey=GB00BD8YWM21GBGBXASQ1',
  },
  {
    id: 'revolut',
    displayName: 'Revolut',
    // Require "Revolut" + fintech context to exclude "revolute" (engineering term) and generic comparisons
    newsQuery: '"Revolut" AND (fintech OR neobank OR "digital bank" OR "banking app" OR payments OR "financial services") AND (funding OR revenue OR product OR launch OR license OR acquisition OR pricing OR regulation OR partnership)',
    blogRssUrl: 'https://blog.revolut.com/rss/',
    pricingUrl: 'https://www.revolut.com/en-US/our-fees/',
  },
  {
    id: 'mercury',
    displayName: 'Mercury',
    // "Mercury" is a common word (planet, car brand) — require fintech anchor terms
    newsQuery: '("Mercury" AND ("Mercury bank" OR "Mercury fintech" OR "Mercury business" OR "Mercury startup") AND (funding OR revenue OR product OR launch OR license OR acquisition OR pricing OR regulation))',
    blogRssUrl: 'https://mercury.com/blog/rss.xml',
    pricingUrl: 'https://mercury.com/pricing',
  },
  {
    id: 'pingpong',
    displayName: 'PingPong',
    // "PingPong" in payments context is distinct — add fintech anchor
    newsQuery: '("PingPong" OR "PingPong payments" OR "PingPong fintech") AND (payments OR fintech OR "cross-border" OR "global payments" OR ecommerce) AND (funding OR revenue OR product OR launch OR license OR acquisition OR pricing OR regulation)',
    pricingUrl: 'https://www.pingpongx.com/us/pricing',
  },
  {
    id: 'aspire',
    displayName: 'Aspire',
    // "Aspire" is a common word — require fintech anchor
    newsQuery: '("Aspire" AND ("Aspire fintech" OR "Aspire payments" OR "Aspire business account" OR "AspireApp" OR "Aspire Singapore") AND (funding OR revenue OR product OR launch OR license OR acquisition OR pricing OR regulation))',
    blogRssUrl: 'https://aspireapp.com/blog/rss.xml',
    pricingUrl: 'https://aspireapp.com/pricing',
  },
  {
    id: 'worldfirst',
    displayName: 'WorldFirst',
    // WorldFirst is distinctive — lower noise risk, but keep fintech context
    newsQuery: '"WorldFirst" AND (payments OR fintech OR "foreign exchange" OR "cross-border" OR "international payments" OR "Ant Group") AND (funding OR revenue OR product OR launch OR license OR acquisition OR pricing OR regulation OR partnership)',
    blogRssUrl: 'https://www.worldfirst.com/uk/blog/feed/',
    pricingUrl: 'https://www.worldfirst.com/uk/business-account/pricing/',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // EXTENDED COMPETITORS
  // Derived from Contify newsletter analysis: companies appearing repeatedly
  // across weekly editions that are strategically relevant to Payoneer's
  // cross-border B2B position. Added to replicate Contify's coverage breadth
  // using direct NewsAPI + RSS sources.
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'nium',
    displayName: 'Nium',
    // Nium is a distinctive brand name in B2B cross-border payments.
    // One of the most frequently cited competitors in Contify across financial,
    // product, and partnership signals. Direct rival in B2B payments infrastructure.
    newsQuery: '"Nium" AND (payments OR fintech OR "cross-border" OR "B2B" OR "international payments" OR "payment infrastructure") AND (funding OR revenue OR product OR launch OR license OR acquisition OR partnership OR regulation)',
    blogRssUrl: 'https://nium.com/blog/feed/',
  },
  {
    id: 'terrapy',
    displayName: 'TerraPay',
    // TerraPay operates cross-border payment corridors connecting banks and mobile
    // wallets globally. Contify regularly covers their corridor expansions and
    // partnership announcements — a direct signal for Payoneer's corridor strategy.
    newsQuery: '"TerraPay" AND (payments OR fintech OR "cross-border" OR remittance OR "payment network" OR corridor OR "mobile wallet") AND (funding OR revenue OR product OR launch OR license OR acquisition OR partnership OR regulation)',
  },
  {
    id: 'thunes',
    displayName: 'Thunes',
    // Thunes runs a B2B cross-border payments network for fintechs, banks, and
    // telcos. Appeared in multiple Contify editions covering network expansions,
    // partnerships with PSPs, and corridor launches relevant to Payoneer's SMB focus.
    newsQuery: '"Thunes" AND (payments OR fintech OR "cross-border" OR "global payments" OR network OR corridor OR "payment infrastructure") AND (funding OR revenue OR product OR launch OR license OR acquisition OR partnership OR regulation)',
  },
  {
    id: 'banking-circle',
    displayName: 'Banking Circle',
    // Banking Circle provides payment infrastructure and banking services to fintechs
    // and PSPs. Contify featured them on stablecoin settlement and licensing moves —
    // signals relevant to Payoneer's infrastructure and treasury positioning.
    newsQuery: '"Banking Circle" AND (payments OR fintech OR banking OR "payment infrastructure" OR "embedded finance" OR stablecoin OR "virtual IBAN") AND (funding OR revenue OR product OR launch OR license OR acquisition OR partnership OR regulation)',
  },
  {
    id: 'western-union',
    displayName: 'Western Union',
    // Western Union is a large incumbent making active digital transformation moves.
    // Contify flagged their stablecoin and "Stable Card" launch — strategic signals
    // for how incumbents are responding to the same market Payoneer serves.
    newsQuery: '"Western Union" AND ("digital payments" OR stablecoin OR fintech OR "digital transformation" OR "WU Digital" OR "cross-border" OR "international payments") AND (product OR launch OR partnership OR strategy OR regulation OR acquisition)',
  },
  {
    id: 'ant-international',
    displayName: 'Ant International',
    // Ant International (Alipay+) is the international arm of Ant Group, distinct
    // from WorldFirst. Contify covers their APAC expansion, Alipay+ upgrades, and
    // cross-border licensing moves — highly relevant to Payoneer's China corridor
    // and APAC strategy.
    newsQuery: '("Ant International" OR "Alipay+" OR ("Ant Group" AND ("international" OR "global" OR "cross-border" OR "overseas"))) AND (payments OR fintech OR "cross-border" OR licensing OR partnership OR expansion) AND (product OR launch OR regulation OR acquisition OR funding)',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // INDUSTRY SIGNALS
  // Broad cross-border payments industry tracker. NewsAPI query covers systemic
  // themes (stablecoins, CBDC, APAC regulation, payment corridors) that Contify
  // surfaces but that are not competitor-specific. RSS feeds pull from Finextra
  // and PYMNTS — the primary trade publications Contify draws from.
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'cross-border-industry',
    displayName: 'Cross-Border Payments Industry',
    newsQuery: '("cross-border payments" OR "international payments" OR "global payments" OR "payment corridor" OR "payment infrastructure") AND (stablecoin OR CBDC OR regulation OR licensing OR launch OR acquisition OR funding OR "new product" OR "payment rails") AND (fintech OR payments)',
    blogRssUrl: 'https://www.finextra.com/rss/headlines.xml',   // Finextra: primary trade publication for payments/fintech
    pressRssUrl: 'https://www.pymnts.com/feed/',                // PYMNTS: high-volume payments news aggregator
  },
];

export const competitorMap = new Map(
  competitors.map((c) => [c.id, c])
);

export const competitorIds = competitors.map((c) => c.id);
