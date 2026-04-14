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
];

export const competitorMap = new Map(
  competitors.map((c) => [c.id, c])
);

export const competitorIds = competitors.map((c) => c.id);
