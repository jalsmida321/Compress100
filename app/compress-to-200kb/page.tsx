import type { Metadata } from "next";
import { ProductToolPage } from "../product-page";
import { pagePath, productPages, SITE_URL } from "../product-config";

const page = productPages["compress-to-200kb"];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: `${SITE_URL}${pagePath(page)}` },
};

export default function CompressTo200KbPage() {
  return <ProductToolPage page={page} />;
}
