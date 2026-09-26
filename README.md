# Open Jev Classifier

Minimal personal Jev classifier: **A is B? → probability**.

The browser never receives the TypeSafe API key. GitHub Pages talks to a Cloudflare Worker, and the Worker holds the secrets.

## Deploy

1. Install Wrangler: `npm i -g wrangler`
2. Login: `wrangler login`
3. In this repo run:
   - `wrangler secret put JEV_API_KEY`
   - `wrangler secret put APP_PASSWORD`
   - `wrangler deploy`
4. Copy the Worker URL into `WORKER_URL` in `index.html`.
5. Enable GitHub Pages from the `main` branch, root directory.

TypeSafe API: POST `/v1/systemone`, model `jev-latest`.

## Security

Do not put the Jev API key in GitHub Pages, JavaScript, or repository secrets expecting Pages to hide it. Keep it only as a Worker secret. `APP_PASSWORD` is checked by the Worker; the browser stores it locally after first entry.
