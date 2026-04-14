/**
 * Daily report job — runs all fetchers, collects results, sends email.
 * Can be triggered manually: `npm run fetch`
 * Or scheduled automatically via node-cron when the server runs.
 */

import '../loadEnv.js';
import { competitors, competitorMap } from '../config/competitors.js';
import { fetchNews } from '../fetch/news.js';
import { fetchRssFeeds } from '../fetch/rss.js';
import { checkPricingPage, pricingDiffToIntelItem } from '../fetch/pricing.js';
import { sendDailyReport } from '../email/sender.js';
import type { IntelItem } from '../types/index.js';

export async function runDailyReport(forceRefresh = true): Promise<IntelItem[]> {
  console.log(`[cron] Starting daily fetch — ${new Date().toISOString()}`);

  const allItems: IntelItem[] = [];
  const errors: string[] = [];

  for (const competitor of competitors) {
    console.log(`[cron] Fetching: ${competitor.displayName}`);

    // News
    try {
      const items = await fetchNews(competitor, forceRefresh);
      allItems.push(...items);
      console.log(`  ✓ news: ${items.length} items`);
    } catch (e) {
      const msg = `${competitor.id} news: ${String(e)}`;
      errors.push(msg);
      console.warn(`  ✗ ${msg}`);
    }

    // RSS feeds
    try {
      const items = await fetchRssFeeds(competitor, forceRefresh);
      allItems.push(...items);
      console.log(`  ✓ feeds: ${items.length} items`);
    } catch (e) {
      const msg = `${competitor.id} feeds: ${String(e)}`;
      errors.push(msg);
      console.warn(`  ✗ ${msg}`);
    }

    // Pricing diff
    if (competitor.pricingUrl) {
      try {
        const diff = await checkPricingPage(competitor);
        if (diff) {
          const item = pricingDiffToIntelItem(diff, competitor.displayName);
          allItems.push(item);
          console.log(`  ✓ pricing: CHANGED`);
        } else {
          console.log(`  ✓ pricing: no change`);
        }
      } catch (e) {
        const msg = `${competitor.id} pricing: ${String(e)}`;
        errors.push(msg);
        console.warn(`  ✗ ${msg}`);
      }
    }
  }

  // Deduplicate by id
  const seen = new Set<string>();
  const unique = allItems.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });

  // Sort by date descending
  unique.sort((a, b) => b.date.localeCompare(a.date));

  console.log(`[cron] Fetch complete — ${unique.length} unique items, ${errors.length} errors`);

  // Send email
  try {
    await sendDailyReport(unique);
  } catch (e) {
    console.error('[cron] Email send failed:', e);
  }

  return unique;
}

// ─── Run directly ─────────────────────────────────────────────────────────────

const isMain = import.meta.url === new URL(process.argv[1], import.meta.url).href;
if (isMain) {
  runDailyReport(true)
    .then((items) => {
      console.log(`Done — ${items.length} items`);
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
