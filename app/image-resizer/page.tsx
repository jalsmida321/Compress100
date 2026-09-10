import type { Metadata } from "next";
import { ProductToolPage } from "../product-page";
import { productPages, SITE_URL } from "../product-config";
const page = productPages["image-resizer"];
export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: `${SITE_URL}/image-resizer` } };
export default function ImageResizerPage() { return <ProductToolPage page={page} />; }
