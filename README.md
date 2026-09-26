# Open Jev Classifier

Tiny local Jev classifier. No Cloudflare, no backend account, no dependencies.

## Run

```sh
git clone https://github.com/kurogedelic/open-jev-classifier.git
cd open-jev-classifier
cp .env.example .env
# put your Jev API key in .env
npm run dev
```

Open http://localhost:3000

The API key stays in `.env` and is never sent to the browser or committed.
