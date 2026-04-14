import { Router } from 'express';
import { competitors } from '../config/competitors.js';
import { getItems, getAllItemsSince, clearCache } from '../db/cache.js';
import { runDailyReport } from '../cron/report.js';

export const router = Router();

// GET /api/status — health check
router.get('/status', (_req, res) => {
  res.json({ status: 'ok', competitors: competitors.map((c) => c.id), timestamp: new Date().toISOString() });
});

// GET /api/items — all cached items, optional ?competitor=&since=&limit=
router.get('/items', (req, res) => {
  const { competitor, since, limit } = req.query as Record<string, string>;
  const items = getItems(competitor, since, limit ? parseInt(limit) : 50);
  res.json({ count: items.length, items });
});

// GET /api/items/:competitorId — items for one competitor
router.get('/items/:competitorId', (req, res) => {
  const { since, limit } = req.query as Record<string, string>;
  const items = getItems(req.params.competitorId, since, limit ? parseInt(limit) : 50);
  res.json({ competitorId: req.params.competitorId, count: items.length, items });
});

// GET /api/briefing?days=1 — all items since N days ago
router.get('/briefing', (req, res) => {
  const days = parseInt((req.query.days as string) ?? '1');
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const items = getAllItemsSince(since);
  res.json({ since, count: items.length, items });
});

// POST /api/fetch — trigger a fresh fetch and email
router.post('/fetch', async (_req, res) => {
  try {
    const items = await runDailyReport(true);
    res.json({ ok: true, itemCount: items.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// DELETE /api/cache — clear cache (optionally per competitor)
router.delete('/cache', (req, res) => {
  const { competitor } = req.query as Record<string, string>;
  clearCache(competitor);
  res.json({ ok: true, cleared: competitor ?? 'all' });
});
