# Cloudflare Pages Deployment

## Build

Use Node.js 22.13 or newer and run:

```bash
npm ci
npm run build
```

The current repository keeps the upstream Vinext/Cloudflare setup. Before production launch, configure the Cloudflare Pages project to use the repository's supported build command and output directory, then verify that all four route URLs return their own HTML documents.

## Domain

Set `compress100.com` as the custom domain in Cloudflare Pages. Keep `SITE_URL` in `app/product-config.ts` aligned with the final canonical domain before indexing.

## Privacy checks

Use browser DevTools Network and confirm no request contains image bytes when adding, compressing or downloading a file. Avoid analytics integrations that inspect filenames or file contents.
