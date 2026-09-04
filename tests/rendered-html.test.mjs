import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Compress100 SEO product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Compress Image to 100KB Online/);
  assert.match(html, /Compress an image to 100KB/);
  assert.match(html, /PRIVATE BY DESIGN/);
  assert.match(html, /WebApplication/);
  assert.match(html, /No upload/);
  assert.match(html, /GPL-3\.0-or-later/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

for (const pathname of ["/gif-compressor", "/compress-to-50kb", "/compress-to-200kb"]) {
  test(`renders SEO route ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<h1>/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, new RegExp(pathname.slice(1).replaceAll("-", "\\-")));
  });
}
