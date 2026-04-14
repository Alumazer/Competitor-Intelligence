import type { CompetitorConfig } from '../types/index.js';

export const ANCHOR_COMPANY = 'Payoneer';

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
    // "Wise" is a common word — require a brand anchor ("Wise.com", "TransferWise", or "Wise platform")
    // OR require both "Wise" + fintech context + signal keyword to reduce noise
    newsQuery: '("Wise.com" OR "TransferWise" OR "Wise payments" OR "Wise platform" OR "Wise fintech" OR "Kristo Kaarmann") AND (funding OR revenue OR product OR launch OR license OR acquisition OR pricing OR regulation OR partnership OR "cross-border" OR "money transfer")',
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
];

export const competitorMap = new Map(
  competitors.map((c) => [c.id, c])
);

export const competitorIds = competitors.map((c) => c.id);
