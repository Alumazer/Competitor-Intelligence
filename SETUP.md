# Competitor Intelligence V2 — Setup Guide

## What this does
Monitors Airwallex, Wise, Revolut, Mercury, PingPong, Aspire, and WorldFirst daily.
Tracks: financial signals, product releases, M&A, regulatory actions, and pricing changes.
Sends a daily email to alumaze@payoneer.com every morning at 07:00 UTC.

---

## Step 1 — Push code to GitHub

You only need to do this once.

1. Open **Terminal** on your Mac (search "Terminal" in Spotlight)
2. Run these commands one by one — copy and paste each line:

```bash
cd ~/Documents/"Cursor- General"/"Competitor Intelligence V2"
git init
git add .
git commit -m "Initial commit — Competitor Intelligence V2"
```

3. Go to **github.com** → click the **+** icon → **New repository**
4. Name it `competitor-intelligence` → click **Create repository**
5. Copy the two commands GitHub shows you under "push an existing repository" and run them in Terminal

---

## Step 2 — Deploy to Railway

1. Go to **railway.app** and log in
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `competitor-intelligence`
4. Railway will detect it's a Node.js project automatically

### Add your environment variables in Railway:
Click your project → **Variables** → add each one:

| Key | Value |
|---|---|
| `NEWS_API_KEY` | *(your NewsAPI key)* |
| `RESEND_API_KEY` | *(your Resend API key)* |
| `REPORT_FROM_EMAIL` | onboarding@resend.dev |
| `REPORT_TO_EMAIL` | alumaze@payoneer.com |
| `PORT` | 3000 |
| `NODE_ENV` | production |
| `CACHE_TTL_HOURS` | 24 |

5. Railway will build and deploy automatically — takes about 2 minutes

---

## Step 3 — Trigger your first fetch

Once deployed, you can trigger a manual fetch to test it:

- In Railway, go to your project → open the URL it gives you
- Or use this command in Terminal (replace YOUR-RAILWAY-URL):

```bash
curl -X POST https://YOUR-RAILWAY-URL/api/fetch
```

You should receive an email within a minute.

---

## Daily schedule

The report runs automatically at **07:00 UTC** every day (10:00 Israel time).
No action needed — it runs whether your laptop is on or off.

---

## Changing the send time

To change when the daily email arrives, open `src/index.ts` and change this line:

```typescript
cron.schedule('0 7 * * *', ...
```

The format is: `minute hour * * *`
- `0 7 * * *` = 07:00 UTC (10:00 Israel)
- `0 6 * * *` = 06:00 UTC (09:00 Israel)
- `0 5 * * *` = 05:00 UTC (08:00 Israel)

---

## Note on the sender email

Currently using `onboarding@resend.dev` as the sender (Resend's test domain).
This works for sending to your own email but may land in spam.

To use your own domain (e.g. `intel@payoneer.com`):
1. Go to resend.com → **Domains** → Add your domain
2. Follow the DNS verification steps
3. Update `REPORT_FROM_EMAIL` in Railway to your verified address
