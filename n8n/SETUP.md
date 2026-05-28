# n8n workflow setup guide

Step-by-step instructions for `lead-qualification-workflow.json`. For app env vars and local dev, see the root [README](../README.md).

---

## Before you start

You need:

- An n8n account (Cloud or self-hosted)
- A Google account (Sheets + Gmail)
- An API key for the **OpenAI Lead Summary** node (OpenAI or [MiniMax OpenAI-compatible](https://api.minimax.io/document/guides/OpenAI_API))

---

## Step 1 — Create the Google Sheet

1. Create a new spreadsheet (or use an existing one).
2. Rename the first tab to **`Leads`**.
3. Enter these headers in **row 1**, columns A–I:

   `Timestamp` · `Name` · `Email` · `Phone` · `Service` · `Budget` · `Timeline` · `Score` · `Status`

4. Copy the **spreadsheet ID** from the URL:  
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

---

## Step 2 — Import the workflow

1. In n8n, open **Workflows** → **Add workflow** → **Import from file**.
2. Choose `n8n/lead-qualification-workflow.json`.
3. Save the workflow (name is pre-filled: *Wipuu Labs - Lead Qualification*).

---

## Step 3 — Connect OpenAI Lead Summary

This node writes the internal sales brief (email body).

1. Open the **OpenAI Lead Summary** node.
2. Under **Credential**, create or select an **OpenAI API** credential.
3. Set the **model** to match your provider (workflow default: `MiniMax-M2.5`). Examples:
   - OpenAI: `gpt-4o-mini`
   - MiniMax: `MiniMax-M2.5` (credential base URL: `https://api.minimax.io/v1` if your n8n version supports a custom base URL on the credential)
4. Save the node.

---

## Step 4 — Connect Append to Google Sheets

1. Open **Append to Google Sheets**.
2. **Credential** → create **Google Sheets OAuth2** and sign in with the Google account that owns the sheet.
3. **Document** → **By ID** → paste your spreadsheet ID from Step 1.
4. **Sheet** → **By Name** → `Leads`.
5. **Mapping column mode** → **Auto-Map Input Data to Columns**  
   (Do not use manual mapping unless you map every column yourself.)
6. Save the node.

---

## Step 5 — Connect Email Lead Summary

1. Open **Email Lead Summary**.
2. **Credential** → create **Gmail OAuth2** and authorize the sending account.
3. **Send To** → replace `REPLACE_WITH_ADMIN_EMAIL` with the inbox that should receive lead alerts.
4. **Sender name** is preset to `Wipuu Labs Leads` (change if you like).
5. Save the node.

---

## Step 6 — Check the Webhook node

1. Open **Webhook**.
2. Confirm **HTTP Method**: `POST`, **Path**: `wipuu-lead`.
3. Leave **Respond** as configured (workflow uses **Respond to Webhook** at the end).
4. No credential required on this node.

---

## Step 7 — Activate and copy the webhook URL

1. Toggle the workflow **Active** (top right).
2. Open **Webhook** again → **Production URL** tab.
3. Copy the full URL (ends with `/webhook/wipuu-lead` or your n8n path).
4. Paste it into the app as `N8N_WEBHOOK_URL` in `.env.local` (and in Vercel for production).

---

## Step 8 — Test end-to-end

### Test in n8n

1. Open **Webhook** → **Listen for test event** (or use **Execute workflow** with test data).
2. Send a sample POST body:

```json
{
  "timestamp": "2026-05-28T12:00:00.000Z",
  "name": "Test User",
  "email": "test@example.com",
  "company": "Acme Inc",
  "phone": "5551234567",
  "service": "Web Development",
  "budget": "$10K-$25K",
  "timeline": "1-2 months",
  "score": "Medium",
  "status": "New"
}
```

3. Confirm:
   - All nodes run green through **Respond to Webhook**
   - A new row appears in **Leads** (Phone populated or empty)
   - You receive the HTML email with the AI summary

### Test from the website

1. Run the app with `N8N_WEBHOOK_URL` set.
2. Complete the chat → contact form → **Submit inquiry**.
3. Verify the same row and email.

---

## Node reference (what each step does)

| Order | Node | Role |
|------:|------|------|
| 1 | Webhook | Receives lead JSON from the app |
| 2 | Normalize Lead Fields | Validates email, builds AI prompt fields |
| 3 | OpenAI Lead Summary | Generates internal brief |
| 4 | Extract Summary Text | Cleans model output |
| 5 | Format Lead Email | Builds HTML + plain-text email |
| 6 | Prepare Sheet Row | Maps fields to sheet column names |
| 7 | Append to Google Sheets | Appends one row |
| 8 | Email Lead Summary | Sends notification |
| 9 | Respond to Webhook | Returns `{ "ok": true }` to the app |

---

## Updating an existing workflow

If you already imported an older version:

1. **Workflows** → ⋮ on this workflow → **Import from file** (replace), or edit nodes in place.
2. Re-apply Steps 3–5 (credentials and placeholders are not in the JSON file).
3. On **Append to Google Sheets**, switch to **Auto-Map** and re-select the document/sheet after any header change.
4. Re-activate and confirm the Production webhook URL did not change (if it did, update `N8N_WEBHOOK_URL`).
