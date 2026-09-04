import type { MetadataRoute } from "next";
import { pagePath, productPages, SITE_URL } from "./product-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(productPages).map((page) => ({ url: `${SITE_URL}${pagePath(page)}`, lastModified: new Date("2026-09-02"), changeFrequency: "monthly", priority: page.slug === "" ? 1 : 0.8 }));
}
