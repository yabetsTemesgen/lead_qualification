# Wipuu Labs — AI Lead Qualification

A Next.js demo for a software agency landing page with a guided lead-qualification chatbot and n8n automation (MiniMax AI summary + Google Sheets).

## Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Automation:** n8n (webhook → MiniMax AI → Google Sheets)
- **Hosting:** Vercel

## Features

- Landing page (hero, services, why us, testimonials, FAQ, contact)
- Conversational AI chat widget (answers service questions, gathers project + contact details from natural dialogue)
- Lead scoring (High / Medium / Low) from budget + timeline
- `POST /api/leads` → forwards to n8n webhook
- Duplicate protection (client localStorage + server 5-minute window)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | API key for `/api/chat` (OpenAI or MiniMax OpenAI-compatible). Required for conversational chat. |
| `OPENAI_BASE_URL` | Optional. Default `https://api.openai.com/v1`. For MiniMax: `https://api.minimax.io/v1` |
| `OPENAI_MODEL` | Optional. Default `gpt-4o-mini`. For MiniMax e.g. `MiniMax-M2.5` |
| `N8N_WEBHOOK_URL` | Full n8n webhook URL. If unset in development, leads are logged to the server console. Required in production. |

## n8n setup

1. Import `n8n/lead-qualification-workflow.json` into n8n.
2. Follow **`n8n/SETUP.md`** — **OpenAI** node (Text → Message a Model); OpenAI or MiniMax credential + matching model ID.
3. Configure **Google Sheets** (OAuth)
4. Create a Google Sheet tab **Leads** with row 1:  
   `Timestamp`, `Name`, `Email`, `Phone`, `Service`, `Budget`, `Timeline`, `Score`, `Status`  
   (Phone is optional on the form — empty in the sheet when omitted. Company is in the **email**.)
5. Replace placeholder Sheet ID and credential IDs in the workflow nodes.
6. Configure **Email Lead Summary** (Gmail) with your admin address and Gmail OAuth.
7. Activate the workflow and copy the **Production** webhook URL into `N8N_WEBHOOK_URL`.


## Project structure

```
app/
  api/leads/route.ts      # Lead submission API
  page.tsx                # Landing page
components/
  chat/                   # Lead chat widget
  landing/                # Landing sections
lib/
  chat/                   # Flow, scoring, validation
  landing-content.ts      # Site copy
n8n/
  lead-qualification-workflow.json
```

## Lead scoring

| Budget | Weight |
|--------|--------|
| <$10K | 1 |
| $10K–$25K | 2 |
| $25K–$50K | 3 |
| $50K+ | 4 |

| Timeline | Weight |
|----------|--------|
| ASAP | 4 |
| 1–2 months | 3 |
| 2–4 months | 2 |
| 4+ months | 1 |

- **High:** total ≥ 6, or $50K+ with ASAP / 1–2 months  
- **Low:** total ≤ 3  
- **Medium:** everything else  

## Deploy (Vercel)

1. Push to GitHub.
2. Import project in Vercel.
3. Set `N8N_WEBHOOK_URL` in project environment variables.
4. Deploy.