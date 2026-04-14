import type { CompetitorConfig } from '../types/index.js';

export const ANCHOR_COMPANY = 'Payoneer';

export const competitors: CompetitorConfig[] = [
  {
    id: 'airwallex',
    displayName: 'Airwallex',
    newsQuery: '"Airwallex" AND (funding OR revenue OR product OR license OR acquisition OR pricing OR regulation)',
    blogRssUrl: 'https://www.airwallex.com/blog/feed',
    pricingUrl: 'https://www.airwallex.com/us/pricing',
  },
  {
    id: 'wise',
    displayName: 'Wise',
    newsQuery: '"Wise" AND (fintech OR payments OR "cross-border") AND (funding OR revenue OR product OR license OR acquisition OR pricing OR regulation)',
    blogRssUrl: 'https://wise.com/us/blog/feed',
    pressRssUrl: 'https://wise.com/gb/press/feed',
    pricingUrl: 'https://wise.com/us/pricing/send-money',
    rnsUrl: 'https://www.londonstockexchange.com/exchange/news/market-news/market-news-home.html?fourWayKey=GB00BD8YWM21GBGBXASQ1',
  },
  {
    id: 'revolut',
    displayName: 'Revolut',
    newsQuery: '"Revolut" AND (funding OR revenue OR product OR license OR acquisition OR pricing OR regulation OR banking)',
    blogRssUrl: 'https://blog.revolut.com/rss/',
    pricingUrl: 'https://www.revolut.com/en-US/our-fees/',
  },
  {
    id: 'mercury',
    displayName: 'Mercury',
    newsQuery: '"Mercury" AND (fintech OR banking OR startup) AND (funding OR revenue OR product OR license OR acquisition OR pricing OR regulation)',
    blogRssUrl: 'https://mercury.com/blog/rss.xml',
    pricingUrl: 'https://mercury.com/pricing',
  },
  {
    id: 'pingpong',
    displayName: 'PingPong',
    newsQuery: '"PingPong" AND (payments OR fintech OR "cross-border") AND (funding OR revenue OR product OR license OR acquisition OR pricing)',
    pricingUrl: 'https://www.pingpongx.com/us/pricing',
  },
  {
    id: 'aspire',
    displayName: 'Aspire',
    newsQuery: '"Aspire" AND (fintech OR payments OR "business account") AND (funding OR revenue OR product OR license OR acquisition OR pricing OR regulation)',
    blogRssUrl: 'https://aspireapp.com/blog/rss.xml',
    pricingUrl: 'https://aspireapp.com/pricing',
  },
  {
    id: 'worldfirst',
    displayName: 'WorldFirst',
    newsQuery: '"WorldFirst" AND (payments OR fintech OR "foreign exchange") AND (funding OR revenue OR product OR license OR acquisition OR pricing OR regulation)',
    blogRssUrl: 'https://www.worldfirst.com/uk/blog/feed/',
    pricingUrl: 'https://www.worldfirst.com/uk/business-account/pricing/',
  },
];

export const competitorMap = new Map(
  competitors.map((c) => [c.id, c])
);

export const competitorIds = competitors.map((c) => c.id);
