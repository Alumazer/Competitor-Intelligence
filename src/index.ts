import './loadEnv.js';
import express from 'express';
import cron from 'node-cron';
import { router } from './api/routes.js';
import { runDailyReport } from './cron/report.js';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use('/api', router);

// ─── Scheduled daily report ───────────────────────────────────────────────────
// Runs every day at 07:00 UTC (adjust to your timezone as needed)

cron.schedule('0 7 * * *', async () => {
  console.log('[scheduler] Running daily report...');
  try {
    await runDailyReport(true);
  } catch (e) {
    console.error('[scheduler] Daily report failed:', e);
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Competitor Intelligence V2            ║
║  Server running on port ${PORT}           ║
║  Daily report: 07:00 UTC              ║
╚════════════════════════════════════════╝
  `);
});
