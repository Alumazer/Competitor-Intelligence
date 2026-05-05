import type { SignalType } from '../types/index.js';

/**
 * Classifies a piece of text into a signal type based on keyword matching.
 * Shared by the NewsAPI fetcher (fetch/news.ts) and RSS fetcher (fetch/rss.ts).
 * Order matters: more specific signals are checked first.
 */
export function classifySignal(text: string): SignalType {
  const t = text.toLowerCase();
  if (/acqui|merger|acquis|partner|deal|joint venture/.test(t))               return 'ma';
  if (/licen|regulat|fine|penalty|sanction|compliance|authority/.test(t))     return 'regulatory';
  if (/pric|fee|plan|packag|subscript|cost|charge/.test(t))                   return 'pricing';
  if (/revenue|funding|raise|valuat|ipo|earning|profit|loss|quarter/.test(t)) return 'financial';
  if (/launch|feature|product|update|release|new|api|integrat/.test(t))       return 'product';
  return 'other';
}
