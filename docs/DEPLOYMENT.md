# Cloudflare Workers Deployment

## Prerequisites

Use Node.js 22.13 or newer. Install dependencies and authenticate Wrangler:

```bash
npm ci
npx wrangler login
npx wrangler whoami
```

The repository uses Cloudflare's Vite plugin with Vinext. `vite.config.ts` configures the RSC and SSR environments, while `worker/index.ts` is the Worker entry point. `wrangler.jsonc` provides the Worker name and runtime compatibility settings.

## Local Build and Preview

Build the Workers bundle:

```bash
npm run cf:build
```

Preview the built application in the Workers runtime:

```bash
npm run cf:preview
```

Verify these routes before production deployment:

```text
/
/compress-to-50kb
/compress-to-200kb
/gif-compressor
/sitemap.xml
/robots.txt
```

The Vinext compatibility check should also pass:

```bash
npx vinext check
```

## Deploy

Deploy the current project:

```bash
npm run cf:deploy
```

This runs `vite build` and deploys the generated `dist/server/wrangler.json` configuration with the `compress100` Worker name. The first deployment creates the Worker and provides a `workers.dev` URL.

## Domain

In Cloudflare, open the `compress100` Worker and add `compress100.com` as a custom domain. Keep `SITE_URL` in `app/product-config.ts` aligned with the final canonical domain before indexing. The domain's DNS must be managed by Cloudflare.

Do not use the GitHub Pages workflow as the production deployment path. It builds the separate static demo under the `/PicLite/` base path. Do not use the Docker workflow for the Workers deployment either; Docker is a separate self-hosting option.

## Privacy checks

Use browser DevTools Network and confirm no request contains image bytes when adding, compressing or downloading a file. Avoid analytics integrations that inspect filenames or file contents.

## GitHub Actions

For automatic deployments from GitHub Actions, add these repository secrets:

- `CLOUDFLARE_API_TOKEN`: an API token with permission to deploy Workers
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID that owns the Worker

Then run the same commands in CI:

```bash
npm ci
npm run cf:deploy
```

Keep the API token in GitHub Actions secrets. Never commit it to `wrangler.jsonc`, `.env` files, or source code.
