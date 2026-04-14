import type { IntelItem, SignalType } from '../types/index.js';
import { ANCHOR_COMPANY } from '../config/competitors.js';

const SIGNAL_LABELS: Record<SignalType, { emoji: string; label: string; color: string }> = {
  financial:  { emoji: '💰', label: 'Financial',   color: '#0066CC' },
  product:    { emoji: '🚀', label: 'Product',      color: '#00875A' },
  ma:         { emoji: '🤝', label: 'M&A',          color: '#6554C0' },
  regulatory: { emoji: '⚖️', label: 'Regulatory',   color: '#DE350B' },
  pricing:    { emoji: '💲', label: 'Pricing',       color: '#FF8B00' },
  other:      { emoji: '📌', label: 'Other',         color: '#6B778C' },
};

function signalBadge(signal: SignalType): string {
  const s = SIGNAL_LABELS[signal];
  return `<span style="background:${s.color};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:0.5px;">${s.emoji} ${s.label}</span>`;
}

function itemRow(item: IntelItem): string {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;vertical-align:top;">
        <div style="margin-bottom:4px;">${signalBadge(item.signal)}</div>
        <div style="font-weight:600;font-size:14px;color:#172B4D;margin:6px 0 4px;">
          <a href="${item.url}" style="color:#172B4D;text-decoration:none;">${item.title}</a>
        </div>
        <div style="font-size:12px;color:#6B778C;margin-bottom:4px;">
          ${item.date.slice(0, 10)} &nbsp;·&nbsp; ${item.type}
        </div>
        ${item.snippet ? `<div style="font-size:13px;color:#42526E;line-height:1.5;">${item.snippet.slice(0, 200)}${item.snippet.length > 200 ? '…' : ''}</div>` : ''}
        <div style="margin-top:6px;">
          <a href="${item.url}" style="font-size:12px;color:#0052CC;">Read more →</a>
        </div>
      </td>
    </tr>`;
}

function competitorSection(name: string, items: IntelItem[]): string {
  return `
    <h2 style="font-size:16px;color:#0052CC;border-left:4px solid #0052CC;padding-left:10px;margin:28px 0 12px;">
      ${name} <span style="font-weight:400;color:#6B778C;font-size:13px;">(${items.length} item${items.length !== 1 ? 's' : ''})</span>
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${items.map(itemRow).join('')}
    </table>`;
}

export function buildEmailHtml(items: IntelItem[], date: string): string {
  const byCompetitor = new Map<string, IntelItem[]>();
  for (const item of items) {
    const list = byCompetitor.get(item.competitorId) ?? [];
    list.push(item);
    byCompetitor.set(item.competitorId, list);
  }

  const signalCounts = items.reduce((acc, i) => {
    acc[i.signal] = (acc[i.signal] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const summaryBadges = Object.entries(signalCounts)
    .map(([s, n]) => {
      const sig = SIGNAL_LABELS[s as SignalType];
      return `<span style="margin-right:8px;">${sig.emoji} <strong>${n}</strong> ${sig.label}</span>`;
    })
    .join('');

  const sections = [...byCompetitor.entries()]
    .map(([id, cItems]) => competitorSection(id.charAt(0).toUpperCase() + id.slice(1), cItems))
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:24px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:620px;">

        <!-- Header -->
        <tr><td style="background:#0052CC;padding:24px 32px;">
          <div style="color:#fff;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Competitor Intelligence</div>
          <div style="color:#fff;font-size:22px;font-weight:700;">Daily Briefing — ${date}</div>
          <div style="color:#B3D4FF;font-size:13px;margin-top:4px;">Anchor: ${ANCHOR_COMPANY} &nbsp;·&nbsp; ${items.length} total items</div>
        </td></tr>

        <!-- Signal summary -->
        <tr><td style="padding:16px 32px;background:#F8F9FF;border-bottom:1px solid #DFE1E6;">
          <div style="font-size:12px;color:#6B778C;margin-bottom:6px;">SIGNALS TODAY</div>
          <div style="font-size:13px;">${summaryBadges || 'No items'}</div>
        </td></tr>

        <!-- Content -->
        <tr><td style="padding:8px 32px 24px;">
          ${items.length === 0
            ? '<p style="color:#6B778C;text-align:center;padding:32px 0;">No new intelligence items found for today.</p>'
            : sections}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F4F5F7;padding:16px 32px;border-top:1px solid #DFE1E6;">
          <div style="font-size:11px;color:#97A0AF;text-align:center;">
            Competitor Intelligence V2 &nbsp;·&nbsp; Auto-generated ${new Date().toISOString()}
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildEmailText(items: IntelItem[], date: string): string {
  const lines = [
    `COMPETITOR INTELLIGENCE — Daily Briefing ${date}`,
    `Anchor: ${ANCHOR_COMPANY} | ${items.length} items`,
    '='.repeat(60),
    '',
  ];

  const byCompetitor = new Map<string, IntelItem[]>();
  for (const item of items) {
    const list = byCompetitor.get(item.competitorId) ?? [];
    list.push(item);
    byCompetitor.set(item.competitorId, list);
  }

  for (const [id, cItems] of byCompetitor) {
    lines.push(`## ${id.toUpperCase()} (${cItems.length} items)`);
    for (const i of cItems) {
      lines.push(`[${i.signal}] ${i.date.slice(0, 10)} — ${i.title}`);
      if (i.snippet) lines.push(`  ${i.snippet.slice(0, 150)}`);
      lines.push(`  ${i.url}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}
