import type { Metadata } from "next";
import { ProductToolPage } from "../product-page";
import { pagePath, productPages, SITE_URL } from "../product-config";

const page = productPages["gif-compressor"];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: `${SITE_URL}${pagePath(page)}` },
};

export default function GifCompressorPage() {
  return <ProductToolPage page={page} />;
}
