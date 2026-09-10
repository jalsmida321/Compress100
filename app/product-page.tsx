import { ArrowRight, Coffee, ImageDown, LockKeyhole, ScanSearch } from "lucide-react";
import Link from "next/link";
import { pagePath, productPages, SITE_URL, type ProductPage } from "./product-config";
import { WebCompressor } from "./web-compressor";

export function ProductToolPage({ page }: { page: ProductPage }) {
  const canonical = `${SITE_URL}${pagePath(page)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Compress100",
      url: canonical,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and a modern browser",
      description: page.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: ["Local image compression", "No file upload", "JPG, PNG, WebP and GIF support", `Target size: ${page.targetKb}KB`],
      isBasedOn: "https://github.com/amiaoapp/PicLite",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Compress100 home">
          <span className="wordmark-icon"><ImageDown size={19} /></span>
          <strong>Compress100</strong>
        </Link>
        <nav aria-label="Image compression tools">
          <Link href="/">100KB</Link>
          <Link href="/compress-to-50kb">50KB</Link>
          <Link href="/compress-to-200kb">200KB</Link>
          <Link href="/gif-compressor">GIF</Link>
          <Link href="/image-resizer">Resize</Link>
        </nav>
        <a className="source-link" href="https://buymeacoffee.com/jalsmidaw" target="_blank" rel="noreferrer"><Coffee size={16} /> Buy me a coffee</a>
      </header>

      <main className="product-main">
        <section className="tool-intro">
          <div className="trust-line"><span><LockKeyhole size={14} /> PRIVATE BY DESIGN · 100% LOCAL PROCESSING</span><span>FREE · NO SIGNUP</span></div>
          <h1>{page.heading}</h1>
          <p>{page.lead}</p>
        </section>

        <WebCompressor page={page} />

        <section className="content-section seo-intro">
          <header><span className="section-label">HOW TO USE</span><h2>Compress an image to 100KB in three steps</h2></header>
          <div className="steps">
            <article><span>01</span><h3>Choose an image</h3><p>Drop a JPG, PNG, WebP or GIF into the compressor, or select one from your device.</p></article>
            <article><span>02</span><h3>Set the target size</h3><p>The 100KB target is applied automatically. The browser tests the real encoded file size.</p></article>
            <article><span>03</span><h3>Download the result</h3><p>Review the original size, output size and savings, then download the compressed image.</p></article>
          </div>
          <div className="privacy-copy"><p>Compress100 is designed for online applications, profile photos, email attachments and websites with strict upload limits. It reduces images to 100KB or less while preserving as much visual quality as possible.</p><p>Your image is processed locally in this browser tab. It does not need to be uploaded to a server or stored in an account.</p></div>
        </section>

        <section className="privacy-section"><div><span className="section-label">SUPPORTED FORMATS</span><h2>JPG, PNG, WebP and GIF</h2></div><div className="privacy-copy"><p>Use Compress100 for JPG and JPEG photos, transparent PNG graphics, WebP images and animated GIF files. Output size and visual results depend on the original image, format and complexity.</p><p>A 100KB limit means 100KB or smaller, not necessarily exactly 100KB. Image encoders produce discrete file sizes, so the final file may be below the limit.</p></div></section>

        <section className="proof-band" aria-label="Privacy and product facts">
          <div><strong>0</strong><span>uploads</span></div>
          <div><strong>100%</strong><span>browser-side</span></div>
          <div><strong>4</strong><span>image formats</span></div>
        </section>

        <section className="content-section">
          <header><span className="section-label">HOW IT WORKS</span><h2>A file limit, handled locally</h2></header>
          <div className="steps">
            <article><span>01</span><UploadStepIcon /><h3>Choose your images</h3><p>Add one file or a batch. Nothing is transferred to Compress100.</p></article>
            <article><span>02</span><ScanSearch size={22} /><h3>Measure real output</h3><p>The browser tests encoded results, reducing quality before dimensions.</p></article>
            <article><span>03</span><ImageDown size={22} /><h3>Download the result</h3><p>See the actual file size, dimensions and savings before downloading.</p></article>
          </div>
        </section>

        <section className="privacy-section">
          <div><span className="section-label">LOCAL MEANS LOCAL</span><h2>Your image never becomes our data.</h2></div>
          <div className="privacy-copy"><p>Compress100 performs decoding, resizing and encoding in this browser tab. There is no image upload endpoint and no account is required.</p><p>Closing the tab releases generated previews. For JPG and PNG images, re-encoding also removes common embedded metadata from the downloaded result.</p></div>
        </section>

        <section className="related-section">
          <header><span className="section-label">RELATED TOOLS</span><h2>Choose another file limit</h2></header>
          <div className="related-links">
            {Object.values(productPages).filter((candidate) => candidate.slug !== page.slug).map((candidate) => (
              <Link href={pagePath(candidate)} key={candidate.slug || "home"}><span>{candidate.gifOnly ? "GIF" : `${candidate.targetKb}KB`}</span><strong>{candidate.heading}</strong><ArrowRight size={18} /></Link>
            ))}
          </div>
        </section>

        <section className="faq-section">
          <header><span className="section-label">FAQ</span><h2>About {page.keyword}</h2></header>
          <div>
            {page.faq.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><strong>Compress100</strong><span>Private image compression in your browser.</span></div>
        <p>Based on <a href="https://github.com/amiaoapp/PicLite">PicLite</a>. Licensed under <a href="https://www.gnu.org/licenses/gpl-3.0.html">GPL-3.0-or-later</a>. <a href="https://github.com/amiaoapp/PicLite">Source code</a>.</p>
      </footer>
    </>
  );
}

function UploadStepIcon() {
  return <FileUploadIcon />;
}

function FileUploadIcon() {
  return <ImageDown size={22} />;
}
