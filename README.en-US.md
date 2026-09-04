# Compress100 / PicLite

Compress100 / PicLite is a local-first image processing project with a browser-based target-size compressor and a cross-platform desktop workbench built with Tauri 2.

It is designed for people who need to meet image upload limits, content creators, and developers who want to process images locally in batches. Images are not sent to the project server by default.

## Project Components

### Compress100 Web

Compress100 is the browser-first product in this repository. It works without installation or an account:

- Compress images to 50KB, 100KB, or 200KB targets
- Support JPG, PNG, WebP, and GIF
- Compress animated GIFs frame by frame
- Process one or multiple files
- Accept drag-and-drop input
- Show actual output size, dimensions, and savings
- Process, preview, and download in the current browser tab
- Use no image upload endpoint; original images stay on the device

Online entry points:

- [Compress100 100KB](https://compress100.com/)
- [Compress to 50KB](https://compress100.com/compress-to-50kb)
- [Compress to 200KB](https://compress100.com/compress-to-200kb)
- [GIF Compressor](https://compress100.com/gif-compressor)
- [GitHub Pages Demo](https://amiaoapp.github.io/PicLite/)

The browser product is intended for quick one-off or batch compression. System tray integration, global shortcuts, persistent clipboard monitoring, and watched folders belong to the desktop app, not the Compress100 Web pages.

### PicLite Desktop

PicLite is the full desktop workbench in this repository. It uses Tauri 2 and Rust and supports Windows, macOS, and Linux. Desktop-only capabilities include:

- Import, convert, compress, and proportionally resize JPEG, PNG, WebP, and GIF files
- Batch import with a low-memory processing queue
- Before/after comparison and actual size and dimension reporting
- Continuous quality, dimension, and output-format controls
- Text watermarks
- 50KB, 100KB, 200KB, or custom size limits
- Clipboard monitoring, global shortcuts, and watched folders
- Local result library and operation management
- Floating results with copy, preview, reveal, undo, further downscaling, and format switching
- Replace the source, rename beside it, or export to a fixed directory
- Result limits, stacked/expanded layouts, and automatic dismissal
- WebDAV, S3/R2, OSS, FTP, and SFTP image-host uploads
- Local HTML/JavaScript or HTTPS URL workbench plugins

## Compression Model

The Web compressor reads the image dimensions and uses the actual Blob size produced by the browser encoder. It adjusts the compression parameters progressively:

1. JPG, WebP, and GIF files first reduce encoding quality or color count.
2. PNG files first try reducing output dimensions.
3. If necessary, both dimensions and quality are adjusted.
4. Every attempt is evaluated using the actual encoded result rather than a theoretical size estimate.

If the original file is already below the target, it is kept unchanged to avoid unnecessary quality loss. Encoders produce discrete file sizes, so a result may be well below the target. If the limit cannot be reached within the quality guardrails, the closest result is kept and the UI reports that condition. Exact target sizes are not guaranteed.

Animated GIFs are decoded, resized, color-quantized, and re-encoded frame by frame. Long or high-resolution GIFs may take longer to process. GIF compression requires a recent Chrome or Edge version with `ImageDecoder` support.

## Desktop Downloads

Download installers from [GitHub Releases](https://github.com/amiaoapp/PicLite/releases):

- Windows x64 / ARM64: `.exe` or `.msi`
- macOS Apple Silicon / Intel: `.dmg`
- Linux x64 / ARM64: `.AppImage` or `.deb`

Current macOS builds use ad-hoc signing. On first launch, macOS may require approval in System Settings → Privacy & Security.

## Self-Hosting with Docker

The Docker Web service listens on container port `3456` by default. With Docker Compose:

```bash
git clone https://github.com/amiaoapp/PicLite.git
cd PicLite
docker compose pull
docker compose up -d
```

Inspect status and logs:

```bash
docker compose ps
docker compose logs -f piclite
```

Create a `.env` file in the project directory to change the bind address, host port, or image tag:

```dotenv
PICLITE_BIND=0.0.0.0
PICLITE_PORT=3456
PICLITE_TAG=latest
```

Build from the current source tree:

```bash
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

Or run the GHCR image directly:

```bash
docker run -d \
  --name piclite \
  -p 3456:3456 \
  --restart unless-stopped \
  ghcr.io/amiaoapp/piclite:latest
```

Open `http://SERVER_IP:3456`. Browser security restrictions mean that the Web service cannot provide the desktop app's system tray, global shortcuts, or persistent folder monitoring.

For a reverse proxy, forward your domain to `http://127.0.0.1:3456`. Caddy example:

```caddyfile
compress100.example.com {
  reverse_proxy 127.0.0.1:3456
}
```

## Local Development

### Requirements

- Node.js `22.13` or newer
- Stable Rust
- Tauri 2 system dependencies for your target platform

Install dependencies:

```bash
npm install
```

Start the Web development server:

```bash
npm run dev
```

Start the desktop development environment:

```bash
npm run desktop:dev
```

## Testing and Builds

Run the complete test suite:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Build the Web app:

```bash
npm run build
```

Build the GitHub Pages version:

```bash
npm run pages:build
```

Build the desktop app:

```bash
npm run desktop:build
```

Platform-specific build scripts are also available:

```bash
npm run desktop:build:win
npm run desktop:build:win:arm64
npm run desktop:build:mac:arm64
npm run desktop:build:mac:x64
npm run desktop:build:linux:arm64
npm run desktop:build:linux:x64
```

## Repository Layout

```text
app/                 Compress100 Web pages, compression logic, and SEO config
desktop/             PicLite desktop React renderer and state management
src-tauri/            Tauri 2 / Rust host, permissions, and packaging config
worker/               Cloudflare Worker / Vinext entry point
build/                Build helpers and application icons
```

## Workbench Plugins

Desktop plugins can be local `.html`, `.js`, or `manifest.json` files, or HTTPS URLs. They are mounted in the desktop workbench's trusted plugin runtime rather than embedded with an `iframe`.

Minimal example:

```html
<!doctype html>
<meta charset="utf-8">
<main id="tool">
  <h1>My image tool</h1>
  <button id="ready">Done</button>
</main>
<script>
  document.querySelector("#ready").onclick = () => {
    window.PicLitePlugin.post("ready", { ok: true });
  };
</script>
```

Open Settings → Plugins in the desktop app to import a plugin, or enter a custom name and HTTPS URL. See the [plugin development guide](docs/PLUGIN_DEVELOPMENT.en-US.md) for the complete API, asset URL rules, and publishing notes. Plugins are executable code; install only plugins from sources you trust.

## Privacy and Security

- Compress100 Web reads, decodes, compresses, previews, and downloads files in the current browser tab.
- The project has no endpoint for receiving original image files for compression.
- Generated preview objects are released when the browser tab is closed.
- Re-encoding JPG and PNG files removes common embedded metadata.
- Desktop files leave the device only when the user explicitly configures and uses an image-host upload.
- Plugins are executable code and should be treated accordingly.

More detail is available in:

- [Project overview](docs/PROJECT.md)
- [Product brief](docs/PRODUCT.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [SEO specification](docs/SEO.md)
- [Plugin development](docs/PLUGIN_DEVELOPMENT.en-US.md)
- [License compliance](docs/LICENSE-COMPLIANCE.md)

## License

PicLite is licensed under [GPL-3.0-or-later](LICENSE).

Its desktop automation workflow is inspired by and adapted from the GPL-licensed [FuzzyIdeas/Clop](https://github.com/FuzzyIdeas/Clop) project. PicLite does not use the Clop trademark. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for details.

For issues and feature requests, use [GitHub Issues](https://github.com/amiaoapp/PicLite/issues).
