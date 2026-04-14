import { Resend } from 'resend';
import { buildEmailHtml, buildEmailText } from './template.js';
import type { IntelItem } from '../types/index.js';

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = process.env.REPORT_FROM_EMAIL ?? 'onboarding@resend.dev';
const TO   = process.env.REPORT_TO_EMAIL   ?? 'alumaze@payoneer.com';

export async function sendDailyReport(items: IntelItem[]): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);
  const subject = `Competitor Intelligence — ${date} (${items.length} items)`;

  const { error } = await resend.emails.send({
    from: FROM,
    to:   TO,
    subject,
    html: buildEmailHtml(items, date),
    text: buildEmailText(items, date),
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
  console.log(`[email] Daily report sent to ${TO} — ${items.length} items`);
}
