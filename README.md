# Hunky Dory English Level Test for Adults

A browser-based CEFR placement test designed for learners aged 18 and over. It assesses grammar, vocabulary, reading, and writing from A0 to B2, then produces a best-fit level result.

## Adult-focused content

- Registration collects age, current situation, and the learner's own email.
- Reading tasks use cafés, commuting, workplace training, public services, and workplace-policy contexts.
- Grammar examples use adult everyday, travel, and professional situations.
- Writing prompts use adult-only or neutral imagery, including three new adult-focused photographs.
- The original results spreadsheet is not connected. This repository starts with blank storage configuration to prevent results being sent to the source project's data store.

Adapted from [trollox812/hunky-dory-level-test](https://github.com/trollox812/hunky-dory-level-test) as a separate adult-focused project.

## Run locally

No build step is required. Serve the directory with any static HTTP server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Results storage

The test works without results storage. To enable Google Sheets:

1. Copy `google-apps-script.gs` into an Apps Script project attached to your results spreadsheet.
2. Deploy it as a web app.
3. Set `googleScriptUrl` and, optionally, `googleSheetUrl` in `config.js`.
4. For a Vercel deployment, also set the `GOOGLE_SCRIPT_URL` environment variable for the serverless proxy.

Use a spreadsheet tab named `Assessment Results`; the script will create it when needed.

## Deployment

The repository includes `vercel.json` and can be deployed as a static Vercel project. It can also be hosted by any static-site provider.
