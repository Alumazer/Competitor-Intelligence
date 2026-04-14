import Database from 'better-sqlite3';
import { createHash } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import type { IntelItem, PricingSnapshot, SourceType } from '../types/index.js';

const DATA_DIR = './data';
const DB_PATH = `${DATA_DIR}/cache.db`;
const CACHE_TTL_HOURS = Number(process.env.CACHE_TTL_HOURS ?? 24);

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);

// ─── Schema ───────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS intel_items (
    id TEXT PRIMARY KEY,
    competitor_id TEXT NOT NULL,
    type TEXT NOT NULL,
    signal TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    url TEXT NOT NULL,
    snippet TEXT NOT NULL,
    fetched_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS fetch_log (
    competitor_id TEXT NOT NULL,
    source_type TEXT NOT NULL,
    fetched_at TEXT NOT NULL,
    PRIMARY KEY (competitor_id, source_type)
  );

  CREATE TABLE IF NOT EXISTS pricing_snapshots (
    competitor_id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    captured_at TEXT NOT NULL,
    text_sample TEXT NOT NULL
  );
`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function makeId(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 16);
}

function isStale(fetchedAt: string): boolean {
  const age = Date.now() - new Date(fetchedAt).getTime();
  return age > CACHE_TTL_HOURS * 60 * 60 * 1000;
}

// ─── Intel items ──────────────────────────────────────────────────────────────

export function isCacheStale(competitorId: string, sourceType: SourceType): boolean {
  const row = db
    .prepare('SELECT fetched_at FROM fetch_log WHERE competitor_id = ? AND source_type = ?')
    .get(competitorId, sourceType) as { fetched_at: string } | undefined;

  if (!row) return true;
  return isStale(row.fetched_at);
}

export function saveItems(items: IntelItem[], competitorId: string, sourceType: SourceType): void {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO intel_items
      (id, competitor_id, type, signal, title, date, url, snippet, fetched_at)
    VALUES
      (@id, @competitorId, @type, @signal, @title, @date, @url, @snippet, @fetchedAt)
  `);

  const logFetch = db.prepare(`
    INSERT OR REPLACE INTO fetch_log (competitor_id, source_type, fetched_at)
    VALUES (?, ?, ?)
  `);

  const now = new Date().toISOString();
  const insertMany = db.transaction(() => {
    for (const item of items) insert.run(item);
    logFetch.run(competitorId, sourceType, now);
  });

  insertMany();
}

export function getItems(competitorId?: string, since?: string, limit = 50): IntelItem[] {
  let query = 'SELECT * FROM intel_items WHERE 1=1';
  const params: string[] = [];

  if (competitorId) { query += ' AND competitor_id = ?'; params.push(competitorId); }
  if (since)        { query += ' AND date >= ?';         params.push(since); }

  query += ' ORDER BY date DESC LIMIT ?';
  params.push(String(limit));

  return db.prepare(query).all(...params) as IntelItem[];
}

export function getAllItemsSince(since: string): IntelItem[] {
  return db
    .prepare('SELECT * FROM intel_items WHERE date >= ? ORDER BY date DESC')
    .all(since) as IntelItem[];
}

// ─── Pricing snapshots ────────────────────────────────────────────────────────

export function getPricingSnapshot(competitorId: string): PricingSnapshot | undefined {
  return db
    .prepare('SELECT * FROM pricing_snapshots WHERE competitor_id = ?')
    .get(competitorId) as PricingSnapshot | undefined;
}

export function savePricingSnapshot(snapshot: PricingSnapshot): void {
  db.prepare(`
    INSERT OR REPLACE INTO pricing_snapshots
      (competitor_id, url, content_hash, captured_at, text_sample)
    VALUES
      (@competitorId, @url, @contentHash, @capturedAt, @textSample)
  `).run(snapshot);
}

// Clears only the fetch log — forces a re-fetch next run but preserves stored intel items.
// Use resetAll() if you truly want to wipe everything.
export function clearCache(competitorId?: string): void {
  if (competitorId) {
    db.prepare('DELETE FROM fetch_log WHERE competitor_id = ?').run(competitorId);
  } else {
    db.exec('DELETE FROM fetch_log;');
  }
}

// Full wipe — removes all stored items AND the fetch log.
// Only use this if you want to start completely from scratch.
export function resetAll(): void {
  db.exec('DELETE FROM intel_items; DELETE FROM fetch_log;');
}
