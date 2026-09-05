# Project Overview

## What This Repository Is

This repository contains two related products built around local-first image processing:

- **Compress100** is the browser-first Web experience for meeting fixed file-size limits.
- **PicLite** is the full desktop workbench for repeated, automated, and batch-oriented image workflows.

They share the repository and product direction, but they do not expose the same feature set. Compress100 intentionally keeps the Web experience focused on upload-limit compression. PicLite adds operating-system integrations and extensibility that browsers cannot provide.

## Product Goals

The core product promise is measurable rather than aspirational:

1. Select a target file size.
2. Process the image locally.
3. Inspect the actual encoded result.
4. Download or continue working with the result.

The compressor does not promise an exact byte count. Image encoders produce discrete output sizes, and aggressive compression can damage visual quality. When a target cannot be reached within the configured guardrails, the product reports that condition instead of hiding it.

## Web Architecture

The Web product is implemented in `app/` with React, TypeScript, and the Vinext/Next-compatible app-router setup.

- `app/product-config.ts` defines the four SEO product pages and their independent metadata, copy, target size, and FAQ content.
- `app/product-page.tsx` renders the shared product shell and structured data.
- `app/web-compressor.tsx` owns browser file selection, drag-and-drop, local previews, result state, and downloads.
- `app/web-compression.ts` implements static-image and animated-GIF compression.
- `app/compression-policy.ts` contains small pure policy helpers used to keep format and savings decisions deterministic.
- `worker/index.ts` adapts the built app to the Cloudflare Worker runtime and handles Vinext image optimization.

The supported SEO routes are:

| Route | Purpose | Target |
| --- | --- | --- |
| `/` | General image compression | 100KB |
| `/compress-to-50kb` | Strict upload limits | 50KB |
| `/compress-to-200kb` | Forms and profile images | 200KB |
| `/gif-compressor` | Animated GIF compression | 100KB |

Each route has its own title, description, heading, FAQ, canonical URL, and structured data while reusing the same compression component.

## Compression Pipeline

For static images, the browser uses `createImageBitmap`, an HTML canvas, and `canvas.toBlob`. JPEG output is drawn over a white background; PNG, WebP, and JPEG preserve the requested supported output type where the browser encoder supports it.

For GIF files, the browser uses `ImageDecoder` to read frames and `gifenc` to quantize colors and write the new animation. Frame delays and looping are retained. This path requires a recent Chrome or Edge implementation with `ImageDecoder`.

`compressToLimit` measures every generated Blob. It starts at a quality of 86 and performs up to twelve passes. Quality is reduced first for lossy formats, PNG dimensions are reduced early, and later passes adjust scale and quality together. The smallest generated result is retained if the target is not reached.

The Web target uses `targetKb * 1,000 * 0.98` as its practical byte ceiling. This leaves a small margin for the displayed target and avoids treating a result close to the boundary as a successful exact match.

## Desktop Architecture

The desktop app uses a Vite-built React renderer hosted by Tauri 2:

- `desktop/` contains the desktop renderer, UI state, operation feedback, and integration types.
- `desktop/tauri-bridge.ts` provides the bridge between the renderer and native capabilities.
- `src-tauri/src/` contains the Rust application host and native commands.
- `src-tauri/capabilities/default.json` defines the enabled Tauri permissions.
- `src-tauri/tauri.conf.json` defines the application identity, windows, icons, and platform packaging.

The desktop product is where clipboard monitoring, global shortcuts, watched folders, floating results, local libraries, uploads, and plugins live. These capabilities require native permissions and are intentionally not represented as available in the browser product.

## Deployment Models

### Browser Demo

The GitHub Pages build is a static Vite output under the `/PicLite/` base path. Compression occurs in the visitor's browser.

### Web Server

The main Web build uses Vinext with Next's `standalone` output. Docker runs the resulting server on port `3456`, with the GHCR image used for the prebuilt deployment path.

### Cloudflare

The repository retains a Cloudflare Worker entry point for Vinext and image optimization. Production deployment uses Node.js `22.13+`, `npm ci`, `npm run cf:build`, and `npm run cf:deploy`. The canonical site URL is maintained in `app/product-config.ts`.

### Desktop Releases

Tauri builds installers for Windows, macOS, and Linux. Platform-specific npm scripts select the target triples; native build dependencies and signing requirements remain platform-specific.

## Privacy Model

The Web compressor does not have an image upload endpoint. File bytes are read by browser APIs, transformed in memory, represented as local Blob URLs, and downloaded through the browser. Closing the tab releases the generated previews.

Desktop image-host uploads are an explicit user action and are separate from local compression. Plugins are trusted executable code and should be reviewed before installation.

When validating privacy behavior, inspect the browser Network panel while adding, compressing, and downloading files. No request should contain the image bytes.

## Verification

The repository's default test command runs both Web and desktop checks:

```bash
npm test
```

The Web suite builds the app and checks rendered HTML, route content, structured data, and compression policy behavior. The desktop suite checks operation feedback, builds the renderer, and runs Rust tests.

For static analysis, run:

```bash
npm run lint
```

## Current Boundaries

- Web compression depends on browser image APIs and available encoder support.
- Animated GIF compression requires `ImageDecoder`; unsupported browsers receive a clear processing error.
- Exact target sizes are not guaranteed.
- Browser builds cannot provide system tray, global shortcuts, persistent clipboard monitoring, or watched folders.
- The desktop plugin runtime executes third-party code and should not be treated as a sandbox for untrusted plugins.
- Cloudflare Workers and Docker are separate deployment options and must be verified independently before launch.

## Related Documentation

- [Product brief](PRODUCT.md)
- [Deployment guide](DEPLOYMENT.md)
- [SEO specification](SEO.md)
- [Plugin development](PLUGIN_DEVELOPMENT.md)
- [License compliance](LICENSE-COMPLIANCE.md)
