# n8n setup (OpenAI + Sheets + Gmail)

## What goes where

| Output | Contents |
|--------|----------|
| **Google Sheet** | Contact + qualification fields only (no AI summary) |
| **Gmail** | Full AI lead brief + contact table |

This matches the test brief: *“Google Sheet **or** email”* — sheet is the lead log; email carries the narrative summary.

## 1. LLM credential

**OpenAI** or **MiniMax** (OpenAI credential, Base URL `https://api.minimax.io/v1`, model e.g. `MiniMax-M2.5`).

## 2. Import workflow

Import `n8n/lead-qualification-workflow.json` and deactivate old `wipuu-lead` workflows.

## 3. Flow

`Webhook` → `Normalize Lead Fields` → `OpenAI Lead Summary` → `Extract Summary Text` → `Format Lead Email` → **`Prepare Sheet Row`** → `Append to Google Sheets` → `Email Lead Summary` → `Respond to Webhook`

## 4. Google Sheet — row 1 headers

Must match **exactly** (add any missing columns):

`Timestamp` | `Name` | `Email` | `Company` | `Phone` | `Service` | `Budget` | `Timeline` | `Score` | `Status`

No **Summary** column needed.

## 5. Google Sheets node

1. Connect **Prepare Sheet Row** (not Format Lead Email).
2. **Mapping Column Mode:** **Map Each Column Below** (pre-filled in import).
3. Each **Values to Send** field should show `={{ $json.Timestamp }}`, etc.
4. If fields are empty → re-import the workflow or copy expressions from the table above.

**Why the error happened:** Manual mapping with **empty** value boxes. n8n requires at least one mapped value when using that mode.

## 6. Gmail — **Email Lead Summary**

1. Gmail OAuth credential
2. **To:** your admin email
3. Subject/body use **`Format Lead Email`** (expressions are pre-set)

## 7. Activate

Save → Active → copy Production webhook URL to `N8N_WEBHOOK_URL` → restart `npm run dev`.
