import { z } from 'zod';
import { competitorIds } from '../config/competitors.js';

export const CompetitorIdSchema = z.enum(
  competitorIds as [string, ...string[]]
).describe('Competitor slug — e.g. "airwallex", "wise"');

export const GetNewsSchema = z.object({
  competitorId: CompetitorIdSchema.optional().describe('Filter to one competitor. Omit for all.'),
  since: z.string().optional().describe('ISO date — only return items on or after this date. E.g. "2026-04-01"'),
  limit: z.number().int().min(1).max(100).default(20).describe('Max items to return'),
  forceRefresh: z.boolean().default(false).describe('Bypass cache and fetch fresh data'),
  signal: z.enum(['financial', 'product', 'ma', 'regulatory', 'pricing', 'other'])
    .optional()
    .describe('Filter by signal type'),
});

export const GetFeedsSchema = z.object({
  competitorId: CompetitorIdSchema.optional(),
  since: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  forceRefresh: z.boolean().default(false),
});

export const GetPricingDiffsSchema = z.object({
  competitorId: CompetitorIdSchema.optional(),
  forceRefresh: z.boolean().default(false),
});

export const GetBriefingSchema = z.object({
  competitorId: CompetitorIdSchema.optional().describe('Focus on one competitor. Omit for full landscape briefing.'),
  lookbackDays: z.number().int().min(1).max(90).default(1).describe('How many days back to include'),
});

export type GetNewsInput = z.infer<typeof GetNewsSchema>;
export type GetFeedsInput = z.infer<typeof GetFeedsSchema>;
export type GetPricingDiffsInput = z.infer<typeof GetPricingDiffsSchema>;
export type GetBriefingInput = z.infer<typeof GetBriefingSchema>;
