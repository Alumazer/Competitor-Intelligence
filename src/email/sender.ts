import { Resend } from 'resend';
import { buildEmailHtml, buildEmailText } from './template.js';
import type { IntelItem } from '../types/index.js';

// Initialized lazily inside the function so a missing key crashes at send time,
// not at startup — makes Railway deployment errors much clearer.
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set. Add it to Railway → Variables.');
  return new Resend(key);
}

export async function sendDailyReport(items: IntelItem[]): Promise<void> {
  const FROM = process.env.REPORT_FROM_EMAIL ?? 'onboarding@resend.dev';
  const TO   = process.env.REPORT_TO_EMAIL   ?? 'alumaze@payoneer.com';
  const date = new Date().toISOString().slice(0, 10);
  const subject = `Competitor Intelligence — ${date} (${items.length} items)`;

  const { error } = await getResend().emails.send({
    from: FROM,
    to:   TO,
    subject,
    html: buildEmailHtml(items, date),
    text: buildEmailText(items, date),
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log(`[email] Daily report sent to ${TO} — ${items.length} items`);
}
